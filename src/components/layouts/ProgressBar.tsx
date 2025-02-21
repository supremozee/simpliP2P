'use client';
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
type Props = {children?: React.ReactNode;};

const ProgressProvider = ({ children }: Props) => {
return (
<>
  {children}
  <ProgressBar
    height="2px"
    color="#0D0E4E"
    options={{ showSpinner: true }}
    shallowRouting
  />
</>
);};

export default ProgressProvider;