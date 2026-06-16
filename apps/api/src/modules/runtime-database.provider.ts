import { getDefaultRuntimeDatabase, type FileBackedRuntimeDatabase } from "@laborator/db";

export const RUNTIME_DATABASE = "RUNTIME_DATABASE";

export const runtimeDatabaseProvider = {
  provide: RUNTIME_DATABASE,
  useFactory: (): FileBackedRuntimeDatabase => getDefaultRuntimeDatabase()
};
