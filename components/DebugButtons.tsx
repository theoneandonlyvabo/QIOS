 'use client'

 import React, { useState } from 'react'

 export default function DebugButtons() {
   const [count, setCount] = useState(0)

   return (
     <div className="fixed top-4 right-4 bg-white dark:bg-gray-800 p-3 rounded shadow-lg z-[9999]">
       <h4 className="font-medium mb-2">Debug</h4>
       <div className="flex items-center space-x-2">
         <button
           onClick={() => setCount((c) => c + 1)}
           className="px-3 py-1 bg-blue-600 text-white rounded"
         >
           Click ({count})
         </button>
         <button
           onClick={() => alert('Alert works')}
           className="px-3 py-1 bg-green-600 text-white rounded"
         >
           Alert
         </button>
       </div>
     </div>
   )
 }
