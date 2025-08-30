import {
  useForm,
  useFieldArray,
  FieldError,
  FieldErrors,
  FieldValues,
  Merge,
  Controller,
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
  HiShieldCheck,
  HiNoSymbol,
  HiTrash,
} from 'react-icons/hi2';
import { Label } from '@/src/components/ui/Label';
import { Input } from '@/src/components/ui/Input'; // si no tenés este, usá un <input className="..." />
import { Checkbox } from '@/src/components/ui/Checkbox'; // idem
import { Card } from '@/src/components/ui/Card';

//
// === NUEVOS TIPOS: Entitlement por DID ===
//
export type ProposalFormEntitlementGrantData = {
  name: 'entitlement_grant';
  did: string; // ej. did:web:openvino.org:user:pablo
  role: string; // ej. ROLE_ADMIN / ROLE_SSH (string que luego hasheamos)
  start?: string; // datetime-local (opcional). Si vacío => ahora
  expiry?: string; // datetime-local (opcional). Si vacío => sin vencimiento
  active: boolean; // habilitado lógicamente
};

export type ProposalFormEntitlementRevokeData = {
  name: 'entitlement_revoke';
  did: string;
  role: string;
  reason?: string;
};

export const emptyEntitlementGrant: ProposalFormEntitlementGrantData = {
  name: 'entitlement_grant',
  did: '',
  role: 'ROLE_SSH',
  start: '',
  expiry: '',
  active: true,
};

export const emptyEntitlementRevoke: ProposalFormEntitlementRevokeData = {
  name: 'entitlement_revoke',
  did: '',
  role: 'ROLE_SSH',
  reason: '',
};

export interface ProposalFormActions {
  actions: ProposalFormAction[];
}

export type ProposalFormAction =
  | ProposalFormWithdrawData
  | ProposalFormMintData
  | ProposalFormMergeData
  | ProposalFormChangeParameter
  | ProposalFormSplitData
  | ProposalFormEntitlementGrantData // <-- NUEVO
  | ProposalFormEntitlementRevokeData; // <-- NUEVO

//
// === Inputs UI para las nuevas acciones ===
//
function Row({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-3 sm:grid-cols-2">{children}</div>;
}

function Field({
  label,
  children,
  tooltip,
}: {
  label: string;
  children: React.ReactNode;
  tooltip?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <Label tooltip={tooltip}>{label}</Label>
      {children}
    </div>
  );
}

function RemoveButton({ onClick }: { onClick: () => void }) {
  return (
    <div className="flex justify-end">
      <Button
        type="button"
        variant="destructive"
        icon={HiTrash}
        onClick={onClick}
        label="Remove"
      />
    </div>
  );
}

export function EntitlementGrantInput({
  register,
  control,
  prefix,
  errors,
  onRemove,
}: {
  register: any;
  control: any;
  prefix: `actions.${number}`;
  errors?: any;
  onRemove: () => void;
}) {
  return (
    <Card className="space-y-3 p-4">
      <div className="flex items-center gap-2 font-medium">
        <HiShieldCheck />
        <span>Grant entitlement (DID)</span>
      </div>
      <Row>
        <Field label="DID" tooltip="did:key / did:web / did:ethr">
          <Input
            placeholder="did:web:openvino.org:user:pablo"
            {...register(`${prefix}.did`, { required: true })}
          />
        </Field>
        <Field
          label="Role"
          tooltip="String que luego se hashea (p. ej. ROLE_ADMIN)"
        >
          <Input
            placeholder="ROLE_SSH"
            {...register(`${prefix}.role`, { required: true })}
          />
        </Field>
      </Row>
      <Row>
        <Field
          label="Start (optional)"
          tooltip="Fecha/hora de inicio. Vacío = ahora"
        >
          <Input type="datetime-local" {...register(`${prefix}.start`)} />
        </Field>
        <Field
          label="Expiry (optional)"
          tooltip="Fecha/hora de vencimiento. Vacío = sin vencimiento"
        >
          <Input type="datetime-local" {...register(`${prefix}.expiry`)} />
        </Field>
      </Row>
      <div className="flex items-center gap-2">
        <Checkbox id={`${prefix}.active`} {...register(`${prefix}.active`)} />
        <Label htmlFor={`${prefix}.active`}>Active</Label>
      </div>
      <RemoveButton onClick={onRemove} />
    </Card>
  );
}

export function EntitlementRevokeInput({
  register,
  prefix,
  errors,
  onRemove,
}: {
  register: any;
  prefix: `actions.${number}`;
  errors?: any;
  onRemove: () => void;
}) {
  return (
    <Card className="space-y-3 p-4">
      <div className="flex items-center gap-2 font-medium">
        <HiNoSymbol />
        <span>Revoke entitlement (DID)</span>
      </div>
      <Row>
        <Field label="DID">
          <Input
            placeholder="did:web:openvino.org:user:pablo"
            {...register(`${prefix}.did`, { required: true })}
          />
        </Field>
        <Field label="Role">
          <Input
            placeholder="ROLE_SSH"
            {...register(`${prefix}.role`, { required: true })}
          />
        </Field>
      </Row>
      <Field label="Reason (optional)">
        <Input placeholder="policy rotated" {...register(`${prefix}.reason`)} />
      </Field>
      <RemoveButton onClick={onRemove} />
    </Card>
  );
}

export type ProposalFormChangeParameter = {
  name: 'change_parameter';
  // placeholder para futuro
};

export type ProposalFormSplitData = {
  name: 'split';
  tokenAddress: string;
};
export const emptySplitData: ProposalFormSplitData = {
  name: 'split',
  tokenAddress: '',
};

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
                      <Card key={field.id} className="p-4">
                        <div className="flex items-center gap-2 font-medium">
                          <HiCog />
                          <span>Change parameter (placeholder)</span>
                        </div>
                        <RemoveButton onClick={() => remove(index)} />
                      </Card>
                    );
                  case 'split':
                    return (
                      <SplitInput
                        key={field.id}
                        onRemove={() => remove(index)}
                      />
                    );
                  case 'entitlement_grant':
                    return (
                      <EntitlementGrantInput
                        key={field.id}
                        register={register}
                        control={control}
                        prefix={prefix}
                        errors={errors.actions?.[index]}
                        onRemove={() => remove(index)}
                      />
                    );
                  case 'entitlement_revoke':
                    return (
                      <EntitlementRevokeInput
                        key={field.id}
                        register={register}
                        prefix={prefix}
                        errors={errors.actions?.[index]}
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

          {/* NUEVOS */}
          <DropdownMenuItem
            onClick={() => append(emptyEntitlementGrant)}
            className="gap-x-2 hover:cursor-pointer"
          >
            <HiShieldCheck className="h-5 w-5 shrink-0" />
            <span>Grant entitlement (DID)</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => append(emptyEntitlementRevoke)}
            className="gap-x-2 hover:cursor-pointer"
          >
            <HiNoSymbol className="h-5 w-5 shrink-0" />
            <span>Revoke entitlement (DID)</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// import {
//   useForm,
//   useFieldArray,
//   FieldError,
//   FieldErrors,
//   FieldValues,
//   Merge,
// } from 'react-hook-form';
// import {
//   StepNavigator,
//   useNewProposalFormContext,
// } from '@/src/pages/NewProposal';
// import {
//   ProposalFormWithdrawData,
//   WithdrawAssetsInput,
//   emptyWithdrawData,
// } from '@/src/components/newProposal/actions/WithdrawAssetsInput';
// import {
//   MintTokensInput,
//   ProposalFormMintData,
//   emptyMintData,
// } from '@/src/components/newProposal/actions/MintTokensInput';
// import {
//   MergePRInput,
//   ProposalFormMergeData,
//   emptyMergeData,
// } from '@/src/components/newProposal/actions/MergePRInput';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuGroup,
//   DropdownMenuTrigger,
//   DropdownMenuItem,
// } from '@/src/components/ui/Dropdown';
// import { Button } from '@/src/components/ui/Button';
// import {
//   HiBanknotes,
//   HiCircleStack,
//   HiCog,
//   HiPlus,
//   HiScissors,
// } from 'react-icons/hi2';

// import { Label } from '@/src/components/ui/Label';
// import { FaGithub } from 'react-icons/fa';

// import {
//   ProposalFormSplitData,
//   emptySplitData,
//   SplitInput,
// } from '@/src/components/newProposal/actions/SplitInput';

// export interface ProposalFormActions {
//   actions: ProposalFormAction[];
// }

// export type ProposalFormAction =
//   | ProposalFormWithdrawData
//   | ProposalFormMintData
//   | ProposalFormMergeData
//   | ProposalFormChangeParameter
//   | ProposalFormSplitData;

// export const Actions = () => {
//   const { setStep, dataStep3, setDataStep3 } = useNewProposalFormContext();

//   const {
//     register,
//     formState: { errors },
//     handleSubmit,
//     getValues,
//     control,
//   } = useForm<ProposalFormActions>({ defaultValues: dataStep3 });

//   const { fields, append, remove } = useFieldArray<ProposalFormActions>({
//     name: 'actions',
//     control: control,
//   });

//   const onSubmit = (data: ProposalFormActions) => {
//     console.log(data);
//     setDataStep3(data);
//     setStep(4);
//   };

//   const handleBack = () => {
//     const data = getValues();
//     setDataStep3(data);
//   };

//   return (
//     <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
//       <div className="space-y-2">
//         <div className="flex flex-col gap-y-1">
//           <Label tooltip="These actions can be executed after a vote successfully passes">
//             Actions
//           </Label>
//           {fields.length === 0 ? (
//             <p className="italic text-highlight-foreground/80">No actions</p>
//           ) : (
//             <div className="flex flex-col gap-6">
//               {fields.map((field: Record<'id', string>, index: number) => {
//                 const prefix: `actions.${number}` = `actions.${index}`;
//                 const action: ProposalFormAction = getValues(prefix);

//                 switch (action.name) {
//                   case 'withdraw_assets':
//                     return (
//                       <WithdrawAssetsInput
//                         register={register}
//                         prefix={prefix}
//                         key={field.id}
//                         errors={errors.actions?.[index]}
//                         onRemove={() => remove(index)}
//                         control={control}
//                       />
//                     );
//                   case 'mint_tokens':
//                     return (
//                       <MintTokensInput
//                         register={register}
//                         control={control}
//                         prefix={prefix}
//                         key={field.id}
//                         errors={errors.actions?.[index]}
//                         onRemove={() => remove(index)}
//                         getValues={getValues}
//                       />
//                     );
//                   case 'merge_pr':
//                     return (
//                       <MergePRInput
//                         register={register}
//                         prefix={prefix}
//                         key={field.id}
//                         errors={errors.actions?.[index]}
//                         onRemove={() => remove(index)}
//                       />
//                     );
//                   case 'change_parameter':
//                     return (
//                       <ChangeParametersInput
//                         control={control}
//                         register={register}
//                         errors={errors?.actions?.[index]}
//                         prefix={prefix}
//                         onRemove={() => remove(index)}
//                       />
//                     );
//                   case 'split':
//                     return (
//                       <SplitInput
//                         key={field.id}
//                         onRemove={() => remove(index)}
//                       />
//                     );
//                 }
//               })}
//             </div>
//           )}
//         </div>
//         <AddActionButton append={append} actions={getValues()} />
//       </div>
//       <StepNavigator onBack={handleBack} />
//     </form>
//   );
// };

// export type ActionFormError<T extends FieldValues> =
//   | Merge<FieldError, FieldErrors<NonNullable<T> | T>>
//   | undefined;

// export const AddActionButton = ({
//   append,
//   actions,
// }: {
//   append: (fn: ProposalFormAction) => void;
//   actions: ProposalFormActions;
// }) => {
//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Button variant="outline" icon={HiPlus} label="Add action" />
//       </DropdownMenuTrigger>
//       <DropdownMenuContent>
//         <DropdownMenuGroup>
//           <DropdownMenuItem
//             onClick={() => append(emptyWithdrawData)}
//             className="gap-x-2 hover:cursor-pointer"
//           >
//             <HiBanknotes className="h-5 w-5 shrink-0" />
//             <span>Budget Approval</span>
//           </DropdownMenuItem>
//           <DropdownMenuItem
//             onClick={() => append(emptySplitData)}
//             className="gap-x-2 hover:cursor-pointer"
//           >
//             <HiScissors className="h-5 w-5 shrink-0" />
//             <span>Split OVI tokens</span>
//           </DropdownMenuItem>
//         </DropdownMenuGroup>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// };
