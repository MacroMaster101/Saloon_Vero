import { describe, it, expect, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { Segmented, Switch } from '@/components/admin/form-kit';

afterEach(cleanup);

// These assert the redesigned controls still submit the SAME form fields the
// server actions read (category radio value; boolean checkbox name). This is
// the "does saving still work" guarantee from the redesign plan.

describe('Segmented (category control)', () => {
  it('renders one radio per option under the given name', () => {
    const { container } = render(
      <Segmented name="category" defaultValue="hair"
        options={[{ value: 'hair', label: 'Hair' }, { value: 'beauty', label: 'Beauty' }]} />,
    );
    const radios = container.querySelectorAll('input[type="radio"][name="category"]');
    expect(radios.length).toBe(2);
    expect(Array.from(radios).map((r) => (r as HTMLInputElement).value)).toEqual(['hair', 'beauty']);
  });

  it('checks the radio matching defaultValue', () => {
    const { container } = render(
      <Segmented name="category" defaultValue="beauty"
        options={[{ value: 'hair', label: 'Hair' }, { value: 'beauty', label: 'Beauty' }]} />,
    );
    const checked = container.querySelector('input[type="radio"]:checked') as HTMLInputElement;
    expect(checked.value).toBe('beauty');
  });
});

describe('Switch (boolean control)', () => {
  it('renders a real checkbox with the given name', () => {
    const { container } = render(<Switch name="is_active" label="Active" defaultChecked />);
    const box = container.querySelector('input[type="checkbox"][name="is_active"]') as HTMLInputElement;
    expect(box).not.toBeNull();
    expect(box.checked).toBe(true);
  });

  it('is unchecked when defaultChecked is false', () => {
    const { container } = render(<Switch name="bookable" label="Bookable" defaultChecked={false} />);
    const box = container.querySelector('input[type="checkbox"][name="bookable"]') as HTMLInputElement;
    expect(box.checked).toBe(false);
  });
});
