'use client';

import { useState, useEffect } from 'react';

const DelayedRender = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000); // 1 second delay

    return () => clearTimeout(timer);
  }, []);

  return isVisible ? <div /> : null;
};

export default DelayedRender;
