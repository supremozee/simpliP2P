"use client";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
type Props = { children?: React.ReactNode };

const ProgressProvider = ({ children }: Props) => {
  return (
    <>
      {children}
      <ProgressBar
        height="2px"
        color="text-primary"
        options={{ showSpinner: true }}
        shallowRouting
      />
    </>
  );
};

export default ProgressProvider;
