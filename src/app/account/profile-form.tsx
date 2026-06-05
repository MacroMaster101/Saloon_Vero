'use client';
import { updateFullName } from './actions';

export function ProfileForm({ fullName, email, role }: { fullName: string; email: string; role: string }) {
  return (
    <form action={updateFullName} className="panel" style={{ maxWidth: 480 }}>
      <h2>Profile</h2>
      <div className="field"><label htmlFor="acct-name">Full name</label><input id="acct-name" name="full_name" defaultValue={fullName} /></div>
      <div className="field"><label htmlFor="acct-email">Email</label><input id="acct-email" value={email} disabled /></div>
      <div className="field"><label htmlFor="acct-role">Role</label><input id="acct-role" value={role} disabled /></div>
      <button className="btn btn--primary" type="submit">Save changes</button>
    </form>
  );
}
