import moment from 'moment-timezone';

const now = (mode: 'unix' | 'millisecond' | 'mysql' | 'response' | string) => {
  const m = moment().tz('Asia/Jakarta');

  switch (mode) {
    case 'millisecond':
      return m.valueOf().toString();
    case 'mysql':
      return m.format('YYYY-MM-DD HH:mm:ss');
    case 'response':
      return m.utc().format('YYYY-MM-DDTHH:mm:ssZZ');
    case 'unix':
      return m.utc().unix().toString();
  }

  return m.valueOf().toString();
};

const monthsOfYear = [
  {month: 'January', monthNumber: 1},
  {month: 'February', monthNumber: 2},
  {month: 'March', monthNumber: 3},
  {month: 'April', monthNumber: 4},
  {month: 'May', monthNumber: 5},
  {month: 'June', monthNumber: 6},
  {month: 'July', monthNumber: 7},
  {month: 'August', monthNumber: 8},
  {month: 'September', monthNumber: 9},
  {month: 'October', monthNumber: 10},
  {month: 'November', monthNumber: 11},
  {month: 'December', monthNumber: 12},
];

export {now, monthsOfYear};
