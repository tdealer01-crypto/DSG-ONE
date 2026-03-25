import { exec } from "child_process";

const ALLOW = ["ls", "pwd", "echo", "cat", "find"];

export function system_exec({ command }: any) {
  if (!command) {
    throw new Error("missing command");
  }

  const cmd = String(command).trim().split(/\s+/)[0];

  if (!ALLOW.includes(cmd)) {
    throw new Error("blocked command: " + cmd);
  }

  return new Promise((resolve, reject) => {
    exec(command, { cwd: process.cwd() }, (err, stdout, stderr) => {
      if (err) {
        return reject(err);
      }

      resolve({
        tool: "system.exec",
        ok: true,
        data: {
          command,
          stdout,
          stderr
        }
      });
    });
  });
}
