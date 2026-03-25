import { browser_open } from "./browser";
import { file_list, file_read, file_write } from "./file";
import { system_exec } from "./system";

export async function handleMcpRequest(method: string, params: any) {
  switch (method) {
    case "browser.open":
      return browser_open(params);

    case "file.list":
      return file_list(params);

    case "file.read":
      return file_read(params);

    case "file.write":
      return file_write(params);

    case "system.exec":
      return system_exec(params);

    default:
      throw new Error("Unknown MCP method: " + method);
  }
}
