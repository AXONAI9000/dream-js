export default function DemoContent() {
  return (
    <div style={{ padding: '80px 40px 40px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '20px' }}>数据统计</h1>
      <p style={{ marginBottom: '40px', color: '#666' }}>查看您的 API 使用情况</p>

      {/* 统计卡片 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' }}>
        <div className="card" style={cardStyle}>
          <div style={{ color: '#888', marginBottom: '8px' }}>请求数</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold' }}>93</div>
        </div>
        <div className="card" style={cardStyle}>
          <div style={{ color: '#888', marginBottom: '8px' }}>Token 数</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold' }}>3,354,758</div>
        </div>
        <div className="card" style={cardStyle}>
          <div style={{ color: '#888', marginBottom: '8px' }}>费用</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold' }}>$1.68</div>
        </div>
        <div className="card" style={cardStyle}>
          <div style={{ color: '#888', marginBottom: '8px' }}>输入 Token 数</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold' }}>133,628</div>
        </div>
      </div>

      {/* 表格 */}
      <h2 style={{ marginBottom: '20px' }}>模型使用统计</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: '8px', overflow: 'hidden' }}>
        <thead>
          <tr style={{ background: '#f9f9f9' }}>
            <th style={thStyle}>模型名称</th>
            <th style={thStyle}>请求数</th>
            <th style={thStyle}>输入 Token</th>
            <th style={thStyle}>输出 Token</th>
            <th style={thStyle}>总费用</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={tdStyle}>claude-haiku-4-5-20251001</td>
            <td style={tdStyle}>63</td>
            <td style={tdStyle}>102,739</td>
            <td style={tdStyle}>5,542</td>
            <td style={tdStyle}>$0.59</td>
          </tr>
          <tr>
            <td style={tdStyle}>claude-opus-4-5-20251101</td>
            <td style={tdStyle}>30</td>
            <td style={tdStyle}>30,889</td>
            <td style={tdStyle}>6,963</td>
            <td style={tdStyle}>$1.08</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

const cardStyle: React.CSSProperties = {
  background: '#fff',
  padding: '24px',
  borderRadius: '8px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  border: '1px solid #eee'
}

const thStyle: React.CSSProperties = {
  padding: '16px',
  textAlign: 'left',
  borderBottom: '1px solid #eee'
}

const tdStyle: React.CSSProperties = {
  padding: '16px',
  borderBottom: '1px solid #eee'
}
