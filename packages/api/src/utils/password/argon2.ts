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
  const promise = wasi.start(instance)
  const errors = stderr.readable.getReader().read()
  const ret = stdout.readable.getReader().read()
  const [errorsStream, resultStream, _] = await Promise.all([errors, ret, promise])
  const errorsValue = new TextDecoder().decode(errorsStream.value)
  if (errorsValue) {
    throw new Error(errorsValue)
  }
  const retValue = new TextDecoder().decode(resultStream.value)
  return retValue.trim()
}

export async function argon2Hash(password: string): Promise<string> {
  return await invoke(['hash', password])
}

export async function argon2Verify(password: string, hashedPassword: string): Promise<boolean> {
  return (await invoke(['verify', password, hashedPassword])) === 'true'
}
