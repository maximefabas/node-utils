import { exec } from 'child_process'

export default async function execPromise (cmd: string) {
  return new Promise((resolve, reject) => exec(cmd, (err, stdout, stderr) => {
    if (err) reject({ err, stdout, stderr })
    else resolve({ stdout, stderr })
  }))
}
