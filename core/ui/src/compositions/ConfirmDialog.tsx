import { Accessor, Component, ComponentProps, createMemo, createSignal, JSX } from 'solid-js';
import { Button } from '../component/Button';
import { ModalBase } from '../component/ModalBase';

interface ConfirmDialogProps {
  type: 'normal' | 'danger';
  description: string;
  okText?: string;
  cancelText?: string;
}
interface ConfirmDialogInternalProps extends ConfirmDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}
const ConfirmDialog: Component<ConfirmDialogInternalProps> = (props) => {
  const confirmButtonColor = createMemo((): ComponentProps<typeof Button>['color'] => {
    if (props.type === 'danger') {
      return 'danger';
    }

    return 'primary';
  });

  return (
    <ModalBase open={props.open}>
      <div class="p-4 bg-white rounded flex flex-col gap-y-2">
        <div>{props.description}</div>
        <div class="flex flex-row justify-end gap-x-2">
          <Button onClick={props.onCancel}>{props.cancelText ?? 'キャンセル'}</Button>
          <Button onClick={props.onConfirm} color={confirmButtonColor()}>
            {props.okText ?? 'OK'}
          </Button>
        </div>
      </div>
    </ModalBase>
  );
};

const noop = () => {};
type ConfirmResult = 'confirmed' | 'cancel';
export const useConfirmDialog = (): [
  confirm: (confirmProps: ConfirmDialogProps) => Promise<ConfirmResult>,
  dialogNode: Accessor<JSX.Element>,
] => {
  const [isOpen, setIsOpen] = createSignal(false);
  const [dialogProps, setDialogProps] = createSignal<ConfirmDialogProps>({ type: 'normal', description: '' });

  const awaiterRef: { onConfirm: () => void; onCancel: () => void } = { onConfirm: noop, onCancel: noop };
  const confirm = async (confirmProps: ConfirmDialogProps): Promise<ConfirmResult> => {
    setDialogProps(confirmProps);
    setIsOpen(true);
    const confirmationPromise = new Promise<ConfirmResult>((res) => {
      awaiterRef.onConfirm = () => {
        res('confirmed');
      };
      awaiterRef.onCancel = () => {
        res('cancel');
      };
    });
    const result = await confirmationPromise;
    setIsOpen(false);
    return result;
  };

  return [
    confirm,
    createMemo(() => (
      <ConfirmDialog
        {...dialogProps()}
        open={isOpen()}
        onConfirm={() => {
          awaiterRef.onConfirm();
        }}
        onCancel={() => {
          awaiterRef.onCancel();
        }}
      />
    )),
  ];
};
