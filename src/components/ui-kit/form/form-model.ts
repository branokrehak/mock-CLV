export class FormModel {
  editedId: string;
  editedField: Record<string, any>;

  get editing() {
    return this.editedId != null;
  }

  startEditing(editedId: string, editedField: Record<string, any>) {
    this.editedField = editedField;
    this.editedId = editedId;
  }

  stopEditing() {
    this.editedId = null;
    this.editedField = null;
  }
}
