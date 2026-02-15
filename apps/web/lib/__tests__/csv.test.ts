import { describe, expect, it } from 'vitest';
import { parseCsv } from '../csv';

describe('parseCsv', () => {
  it('parses rows with headers', () => {
    const rows = parseCsv('a,b\n1,2\n3,4');
    expect(rows).toHaveLength(2);
    expect(rows[0]).toEqual({ a: '1', b: '2' });
  });
});
