import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`rounded-lg bg-white shadow-md ${className}`}>
      {children}
    </div>
  );
}

interface CardTitleProps {
  children: ReactNode;
}

export function CardTitle({ children }: CardTitleProps) {
  return (
    <div className="border-b border-gray-200 px-6 py-4">
      {children}
    </div>
  );
}

interface CardHeadlineProps {
  children: ReactNode;
}

export function CardHeadline({ children }: CardHeadlineProps) {
  return (
    <h2 className="text-2xl font-normal text-gray-900">
      {children}
    </h2>
  );
}

interface CardSubheadProps {
  children: ReactNode;
}

export function CardSubhead({ children }: CardSubheadProps) {
  return (
    <p className="mt-1 text-sm text-gray-600">
      {children}
    </p>
  );
}

interface CardContentProps {
  children: ReactNode;
}

export function CardContent({ children }: CardContentProps) {
  return (
    <div className="px-6 py-4">
      {children}
    </div>
  );
}

interface CardDividerProps {
  className?: string;
}

export function CardDivider({ className = '' }: CardDividerProps) {
  return <hr className={`my-4 border-t border-gray-200 ${className}`} />;
}

interface CardCaptionProps {
  children: ReactNode;
}

export function CardCaption({ children }: CardCaptionProps) {
  return (
    <p className="mt-2 text-xs text-gray-500">
      {children}
    </p>
  );
}

