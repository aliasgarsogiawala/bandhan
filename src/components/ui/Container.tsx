import React from "react";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
  clean?: boolean;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  className = "",
  as: Component = "div",
  clean = false,
}) => {
  return (
    <Component
      className={`mx-auto w-full ${
        clean ? "" : "max-w-7xl px-4 sm:px-6 lg:px-8"
      } ${className}`}
    >
      {children}
    </Component>
  );
};

export default Container;
