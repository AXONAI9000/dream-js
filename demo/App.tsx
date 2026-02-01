import { MatrixProvider, useMatrix } from '../src'
import DemoContent from './DemoContent'

function ToggleButton() {
  const { toggle, isActive, isTransitioning } = useMatrix()

  return (
    <button
      onClick={toggle}
      disabled={isTransitioning}
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '12px 24px',
        fontSize: '16px',
        cursor: isTransitioning ? 'wait' : 'pointer',
        zIndex: 10000,
        borderRadius: '8px',
        border: '2px solid #00ff00',
        background: isActive ? '#000' : '#fff',
        color: isActive ? '#00ff00' : '#000',
        fontWeight: 'bold',
        transition: 'all 0.3s'
      }}
    >
      {isTransitioning ? '切换中...' : isActive ? '关闭科技风' : '开启科技风'}
    </button>
  )
}

export default function App() {
  return (
    <MatrixProvider
      onActivate={() => console.log('科技风已激活')}
      onDeactivate={() => console.log('已恢复普通模式')}
    >
      <ToggleButton />
      <DemoContent />
    </MatrixProvider>
  )
}
