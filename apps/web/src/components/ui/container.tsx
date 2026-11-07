import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  as?: React.ElementType;
}

export function Container({
  children,
  className,
  as: Component = 'div',
  ...props
}: ContainerProps) {
  return (
    <Component
      className={twMerge(clsx('max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full', className))}
      {...props}
    >
      {children}
    </Component>
  );
}
