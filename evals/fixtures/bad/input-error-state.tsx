// Bad: raw <input>/<label> instead of Input, inline styles, raw hex colours, no error wiring.
export default function EmailField() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ color: '#344054', fontWeight: 600 }}>Email</label>
      <input type="email" placeholder="you@company.com" style={{ border: '1px solid #f04438', borderRadius: 8, padding: '10px 14px' }} />
      <span style={{ color: '#d92d20' }}>Enter a valid email address</span>
    </div>
  );
}
