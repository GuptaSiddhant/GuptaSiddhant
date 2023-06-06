import { Form } from "@remix-run/react";

import { usePopoverContext } from ".";
import Button from "../Button";
import Input from "../Input";
import { H6 } from "../Text";

export interface PopoverRenameContentProps {
  previousName: string;
}

export default function PopoverRenameContent({
  previousName,
}: PopoverRenameContentProps): JSX.Element | null {
  const { closePopover, initialFocusRef } =
    usePopoverContext<HTMLInputElement>();

  return (
    <Form
      method="PATCH"
      className="flex flex-col gap-2 p-4"
      onSubmit={closePopover}
    >
      <H6>Rename file</H6>
      <div className="flex items-end justify-end gap-2">
        <input type="hidden" name="previousName" value={previousName} />
        <Input
          inputRef={initialFocusRef}
          type={"text"}
          name={"name"}
          defaultValue={previousName}
          label={<span className="text-sm">Name</span>}
          className="w-full"
          required
        />
        <Button.Secondary type="button" onClick={closePopover}>
          Cancel
        </Button.Secondary>
        <Button.Primary type="submit">Rename</Button.Primary>
      </div>
    </Form>
  );
}
