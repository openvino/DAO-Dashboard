import {
  useForm,
  useFieldArray,
  FieldError,
  FieldErrors,
  FieldValues,
  Merge,
} from 'react-hook-form';
import {
  StepNavigator,
  useNewProposalFormContext,
} from '@/src/pages/NewProposal';
import {
  ProposalFormWithdrawData,
  WithdrawAssetsInput,
  emptyWithdrawData,
} from '@/src/components/newProposal/actions/WithdrawAssetsInput';
import {
  MintTokensInput,
  ProposalFormMintData,
  emptyMintData,
} from '@/src/components/newProposal/actions/MintTokensInput';
import {
  MergePRInput,
  ProposalFormMergeData,
  emptyMergeData,
} from '@/src/components/newProposal/actions/MergePRInput';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from '@/src/components/ui/Dropdown';
import { Button } from '@/src/components/ui/Button';
import {
  HiBanknotes,
  HiCircleStack,
  HiCog,
  HiPlus,
  HiScissors,
} from 'react-icons/hi2';

import { Label } from '@/src/components/ui/Label';
import { FaGithub } from 'react-icons/fa';

import {
  ProposalFormSplitData,
  emptySplitData,
  SplitInput,
} from '@/src/components/newProposal/actions/SplitInput';

export interface ProposalFormActions {
  actions: ProposalFormAction[];
}

export type ProposalFormAction =
  | ProposalFormWithdrawData
  | ProposalFormMintData
  | ProposalFormMergeData
  | ProposalFormChangeParameter
  | ProposalFormSplitData;

export const Actions = () => {
  const { setStep, dataStep3, setDataStep3 } = useNewProposalFormContext();

  const {
    register,
    formState: { errors },
    handleSubmit,
    getValues,
    control,
  } = useForm<ProposalFormActions>({ defaultValues: dataStep3 });

  const { fields, append, remove } = useFieldArray<ProposalFormActions>({
    name: 'actions',
    control: control,
  });

  const onSubmit = (data: ProposalFormActions) => {
    console.log(data);
    setDataStep3(data);
    setStep(4);
  };

  const handleBack = () => {
    const data = getValues();
    setDataStep3(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="space-y-2">
        <div className="flex flex-col gap-y-1">
          <Label tooltip="These actions can be executed after a vote successfully passes">
            Actions
          </Label>
          {fields.length === 0 ? (
            <p className="italic text-highlight-foreground/80">No actions</p>
          ) : (
            <div className="flex flex-col gap-6">
              {fields.map((field: Record<'id', string>, index: number) => {
                const prefix: `actions.${number}` = `actions.${index}`;
                const action: ProposalFormAction = getValues(prefix);

                switch (action.name) {
                  case 'withdraw_assets':
                    return (
                      <WithdrawAssetsInput
                        register={register}
                        prefix={prefix}
                        key={field.id}
                        errors={errors.actions?.[index]}
                        onRemove={() => remove(index)}
                        control={control}
                      />
                    );
                  case 'mint_tokens':
                    return (
                      <MintTokensInput
                        register={register}
                        control={control}
                        prefix={prefix}
                        key={field.id}
                        errors={errors.actions?.[index]}
                        onRemove={() => remove(index)}
                        getValues={getValues}
                      />
                    );
                  case 'merge_pr':
                    return (
                      <MergePRInput
                        register={register}
                        prefix={prefix}
                        key={field.id}
                        errors={errors.actions?.[index]}
                        onRemove={() => remove(index)}
                      />
                    );
                  case 'change_parameter':
                    return (
                      <ChangeParametersInput
                        control={control}
                        register={register}
                        errors={errors?.actions?.[index]}
                        prefix={prefix}
                        onRemove={() => remove(index)}
                      />
                    );
                  case 'split':
                    return (
                      <SplitInput
                        key={field.id}
                        onRemove={() => remove(index)}
                      />
                    );
                }
              })}
            </div>
          )}
        </div>
        <AddActionButton append={append} actions={getValues()} />
      </div>
      <StepNavigator onBack={handleBack} />
    </form>
  );
};

export type ActionFormError<T extends FieldValues> =
  | Merge<FieldError, FieldErrors<NonNullable<T> | T>>
  | undefined;

export const AddActionButton = ({
  append,
  actions,
}: {
  append: (fn: ProposalFormAction) => void;
  actions: ProposalFormActions;
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" icon={HiPlus} label="Add action" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => append(emptyWithdrawData)}
            className="gap-x-2 hover:cursor-pointer"
          >
            <HiBanknotes className="h-5 w-5 shrink-0" />
            <span>Budget Approval</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => append(emptySplitData)}
            className="gap-x-2 hover:cursor-pointer"
          >
            <HiScissors className="h-5 w-5 shrink-0" />
            <span>Split OVI tokens</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
