// From https://github.com/auth70/argon2-wasi/blob/292a030/bin/argon2-wasi.wasm
// Uses rust package argon2 v0.5.1
// @ts-ignore TS2307: Cannot find module './argon2-wasi.wasm'
import argon2 from './argon2-wasi.wasm'
import { WASI } from '@cloudflare/workers-wasi'

export async function invoke(args: string[]) {
  const stdout = new TransformStream()
  const stderr = new TransformStream()
  const wasi = new WASI({
    args: ['argon2-wasi.wasm', ...args],
    stdout: stdout.writable,
    stderr: stderr.writable,
  })
  const instance = new WebAssembly.Instance(argon2, {
    wasi_snapshot_preview1: wasi.wasiImport,
  })
  await wasi.start(instance)
  const errors = await stderr.readable.getReader().read()
  const errorsValue = new TextDecoder().decode(errors.value)
  if (errorsValue) {
    throw new Error(errorsValue)
  }
  const ret = await stdout.readable.getReader().read()
  const retValue = new TextDecoder().decode(ret.value)
  return retValue.trim()
}

export async function argon2Hash(password: string): Promise<string> {
  return await invoke(['hash', password])
}

export async function argon2Verify(password: string, hashedPassword: string): Promise<boolean> {
  return (await invoke(['verify', password, hashedPassword])) === 'true'
}
