export class SampleService {
  // constructor () {
  // }

  sayHello () {
    alert('Hi, I\'m SampleService!')
    // 开发代码块，生产环境会去掉
    /* develblock:start */
    alert('DEBUG')
    /* develblock:end */
  }
}

export function myAPI (paramet) {
  return [
    'apiPath',
    {
      parameter1: paramet,
      parameter2: 'parameter2'
    }
  ]
}
