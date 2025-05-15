import { ProposalFormAction } from '@/src/components/newProposal/steps/Actions';
import { ProposalFormVotingSettings } from '@/src/components/newProposal/steps/Voting';
import ProposalActions, {
  IProposalAction,
} from '@/src/components/proposal/ProposalActions';
import { ProposalResources } from '@/src/components/proposal/ProposalResources';
import { HeaderCard } from '@/src/components/ui/HeaderCard';
import { MainCard } from '@/src/components/ui/MainCard';
import { useToast } from '@/src/hooks/useToast';
import { getTimeInxMinutesAsDate, inputToDate } from '@/src/lib/date-utils';
import { anyNullOrUndefined } from '@/src/lib/utils';
import {
  StepNavigator,
  useNewProposalFormContext,
} from '@/src/pages/NewProposal';
import { add, format } from 'date-fns';
import DOMPurify from 'dompurify';
import { useForm } from 'react-hook-form';
import { HiChatBubbleLeftRight } from 'react-icons/hi2';
import { ErrorWrapper } from '../../ui/ErrorWrapper';
import CategoryList from '@/src/components/ui/CategoryList';

export const Confirmation = () => {
  const { dataStep1, dataStep2, dataStep3 } = useNewProposalFormContext();
  const { toast } = useToast();

  const {
    handleSubmit,
    formState: { errors, isValid },
    setError,
  } = useForm({
    defaultValues: {
      step1: dataStep1,
      step2: dataStep2,
      step3: dataStep3,
      step4: { startTimevalidation: '' },
    },
  });

  const onSubmitValidate = (): Boolean => {
    if (anyNullOrUndefined(dataStep1, dataStep2, dataStep3)) {
      setError('root.step4error', {
        type: 'custom',
        message: 'Some data appears to be missing, please enter all steps',
      });
      return false;
    }

    if (dataStep2!.start_time_type === 'custom') {
      let start = inputToDate(
        dataStep2!.custom_start_date!,
        dataStep2!.custom_start_time!,
        dataStep2!.custom_start_timezone!
      );
      let minStart = getTimeInxMinutesAsDate(5);
      if (start <= minStart) {
        setError('root.step4error', {
          type: 'custom',
          message:
            'The proposal start time must be in the future at the moment of execution',
        });
        return false;
      }
    }
    return true;
  };

  const onSubmitSend = async (data: any) => {
    console.log('[Proposal data to submit]', data);
    toast({
      title: 'Mock submission',
      description: 'Proposal submitted successfully (mocked)',
      variant: 'success',
    });
  };

  const onSubmit = async (data: any) => {
    const valid = onSubmitValidate();
    if (isValid && valid) {
      onSubmitSend(data);
    }
  };

  const actions: IProposalAction[] = dataStep3
    ? dataStep3.actions.map((action: ProposalFormAction) => {
        switch (action.name) {
          case 'withdraw_assets':
            return {
              method: 'withdraw',
              interface: 'IWithdraw',
              params: {
                to: action.recipient,
                amount: action.amount,
                tokenAddress: action.tokenAddress,
              },
            };
          case 'mint_tokens':
            return {
              method: 'mint',
              interface: 'IMint',
              params: {
                to: action.wallets.map((wallet) => ({
                  to: wallet.address,
                  amount: wallet.amount,
                  tokenId: 0,
                })),
              },
            };
          case 'merge_pr':
            return {
              method: 'merge',
              interface: 'IMerge',
              params: { url: action.inputs.url },
            };
          case 'change_parameter':
            return {
              method: 'change',
              interface: 'IChange',
              params: {
                plugin: action.plugin,
                parameter: action.parameter,
                value: action.value,
              },
            };
          default:
            return {
              method: '',
              interface: '',
              params: {},
            };
        }
      })
    : [];

  const htmlClean = DOMPurify.sanitize(
    dataStep1?.description ?? '<p>Proposal has no body</p>'
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <HeaderCard
          variant="outline"
          title={dataStep1?.title ?? 'No title'}
          className="md:col-span-2"
        >
          <p className="text-lg font-medium leading-5 text-highlight-foreground/80">
            {dataStep1?.summary ?? 'No summary'}
          </p>
          {dataStep1?.description !== '<p></p>' && (
            <div
              className="styled-editor-content"
              dangerouslySetInnerHTML={{ __html: htmlClean }}
            />
          )}
        </HeaderCard>

        <div className="flex flex-col gap-y-4">
          <ProposalResources
            variant="outline"
            resources={dataStep1?.resources ?? []}
          />
          <ProposalActions variant="outline" actions={actions} />
        </div>

        <MainCard
          icon={HiChatBubbleLeftRight}
          variant="outline"
          header="Voting settings"
        >
          {!dataStep2 ? (
            <p className="italic text-highlight-foreground/80">
              No data available
            </p>
          ) : (
            <CategoryList categories={getCategories(dataStep2)} />
          )}
        </MainCard>
      </div>

      <ErrorWrapper name="submit" error={errors?.root?.step4error as any}>
        <StepNavigator />
      </ErrorWrapper>
    </form>
  );
};

const getCategories = (data: ProposalFormVotingSettings) => {
  let startDate =
    data.start_time_type === 'now'
      ? 'now'
      : data.custom_start_date &&
        data.custom_start_time &&
        data.custom_start_timezone
      ? format(
          inputToDate(
            data.custom_start_date,
            data.custom_start_time,
            data.custom_start_timezone
          ),
          'Pp'
        )
      : 'N/A';

  let endDate;
  if (data.end_time_type === 'end-custom') {
    endDate =
      data.custom_end_date && data.custom_end_time && data.custom_end_timezone
        ? format(
            inputToDate(
              data.custom_end_date,
              data.custom_end_time,
              data.custom_end_timezone
            ),
            'Pp'
          )
        : 'N/A';
  } else {
    const now = new Date();
    endDate = format(
      add(now, {
        days: data.duration_days,
        hours: data.duration_hours,
        minutes: data.duration_minutes,
      }),
      'Pp'
    );
  }

  return [
    {
      title: 'Decision rules',
      items: [{ label: 'Voting Option', value: data.option }],
    },
    {
      title: 'Voting Period',
      items: [
        { label: 'Start', value: startDate },
        { label: 'End', value: endDate },
      ],
    },
  ];
};
