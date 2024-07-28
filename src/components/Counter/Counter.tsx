'use client';

import React, { useState } from 'react';

export default function Count() {
  const [count, setCount] = useState(0);

  return (
    <button
      className="cursor-pointer rounded-lg bg-[#f07878] p-4 text-lg text-white hover:bg-[#dc5050]"
      onClick={() => setCount(count + 1)}
    >
      Count {count}
    </button>
  );
}
