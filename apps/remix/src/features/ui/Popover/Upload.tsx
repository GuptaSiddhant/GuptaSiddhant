import { Form } from "@remix-run/react";

import { usePopoverContext } from ".";
import Button from "../Button";
import Input from "../Input";
import { H6 } from "../Text";

export interface PopoverUploadContentProps {
  multiple?: boolean;
}

export default function PopoverUploadContent({
  multiple = true,
}: PopoverUploadContentProps): JSX.Element | null {
  const { closePopover, initialFocusRef } =
    usePopoverContext<HTMLInputElement>();

  return (
    <Form
      method="POST"
      encType="multipart/form-data"
      className="flex flex-col gap-2 p-4"
      onSubmit={closePopover}
    >
      <H6>Upload file(s)</H6>
      <input
        id="file_upload"
        type="file"
        name="files"
        multiple={multiple}
        required
        ref={initialFocusRef}
        className="w-full"
      />

      <div className="flex items-end justify-end gap-2">
        <Input
          type={"text"}
          name={"destination"}
          placeholder={"Destination dir..."}
          label={<span className="text-sm">Path</span>}
          className="w-full"
        />
        <Button.Secondary type="button" onClick={closePopover}>
          Cancel
        </Button.Secondary>
        <Button.Primary type="submit">Upload</Button.Primary>
      </div>
    </Form>
  );
}
