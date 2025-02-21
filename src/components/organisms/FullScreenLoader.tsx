import React from 'react'
import Loader from '../molecules/Loader';

const FullScreenLoader = () => (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
      <Loader />
    </div>
  );

export default FullScreenLoader