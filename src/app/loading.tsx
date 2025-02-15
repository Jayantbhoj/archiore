"use client"
import { ClipLoader } from 'react-spinners';

const LoadingSpinner = () => (
  <div className="flex justify-center items-center w-full h-screen bg-gray-200">
    <ClipLoader size={50} color="myBlack" />
  </div>
);

export default LoadingSpinner;