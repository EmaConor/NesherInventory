import { IconX } from "@tabler/icons-react";

interface Props {
  isOpen: boolean;
  onClose?: () => void;
  title?: string;
  children?: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }:Props ) {
  if (!isOpen) return null;
  return (
    <div className="pt-10 fixed inset-0 z-100 flex items-center justify-center p-4 bg-background/10 backdrop-blur-xs overflow-scroll">
      <div className="bg-card rounded-2xl p-6 w-full max-w-lg border border-border">
        <div className="flex justify-between items-center mb-6 ">
          <h2 className="font-serif text-xl">{title}</h2>
          <button  className="cursor-pointer" onClick={onClose}><IconX /></button>
        </div>
        {children}
      </div>
    </div>
  );
}