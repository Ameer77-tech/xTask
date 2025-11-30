import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import React from 'react'

const MobileBtn = () => {
  return (
    <div className='md:hidden fixed bottom-10 right-5 z-100'>
        <Button size={"lg"}><Plus /></Button>
    </div>
  )
}

export default MobileBtn