import { z } from 'zod';

type FileSystem = (
  | {
  readonly type: 'directory';
  readonly children: readonly FileSystem[];
}
  | {
  readonly type: 'file';
}
  ) & {
  readonly name: FileSystemName;
};

const fileSystemNameSchema = z.string().min(1).max(255).brand('fileSystemName');
type FileSystemName = z.infer<typeof fileSystemNameSchema>;

const fileSystemBaseSchema = z.object({
  name: fileSystemNameSchema
});

const fileSystemDirectoryBaseSchema = fileSystemBaseSchema.extend({
  type: z.literal('directory')
});

type FileSystemDirectory = z.infer<typeof fileSystemDirectoryBaseSchema> & {
  readonly children: readonly FileSystem[];
}

const fileSystemDirectorySchema: z.ZodType<FileSystemDirectory> = fileSystemDirectoryBaseSchema.extend({
  children: z.lazy(() => z.array(fileSystemSchema))
});

const fileSystemFileSchema = fileSystemBaseSchema.extend({
  type: z.literal('file')
});

export const fileSystemSchema = z.discriminatedUnion('type', [
  fileSystemDirectorySchema,
  fileSystemFileSchema
]);

console.log(fileSystemSchema.parse({
  type: 'directory', name: 'foo', children: [{
    type: 'directory',
    name: 'bar',
    children: [{
      type: 'file',
      name: 'baz'
    }, {
      type: 'file',
      name: 'qux'
    }]
  }]
}));

export function setupCounter(element: HTMLButtonElement) {
  let counter = 0;
  const setCounter = (count: number) => {
    counter = count;
    element.innerHTML = `count is ${counter}`;
  };
  element.addEventListener('click', () => setCounter(counter + 1));
  setCounter(0);
}
