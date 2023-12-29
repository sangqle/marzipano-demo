import Pano from '@/components/Pano';
import { data } from '@/data';


export default function Home() {
  return (
    <div className='App'>
      <Pano data={data} />
    </div>
  )
}
