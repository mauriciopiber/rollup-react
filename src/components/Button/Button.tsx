'use client';

import React, { ReactNode, useCallback } from 'react';

export interface ButtonProps {
  children: ReactNode;
  onClick: () => void;
}

export const Button = (props: ButtonProps) => {
  const { children, onClick, ...rest } = props;

  const handleOnClick = useCallback(() => {
    onClick();
  }, [onClick]);

  return (
    <button
      className="rounded-3xl bg-blue-300 px-4 py-2 text-gray-700 outline-2 hover:bg-blue-400"
      type="button"
      onClick={handleOnClick}
      {...rest}
    >
      {children}
    </button>
  );
};

export const VARIANT = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
};

export default Button;
