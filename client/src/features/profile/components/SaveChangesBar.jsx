import { Save } from "lucide-react";
import Button from "../../../shared/components/ui/button";

export default function SaveChangesBar({ visible, saving, onSave, onCancel }) {
    if (!visible) return null;

    return (
        <div className="sticky bottom-0 left-0 right-0 mt-6 bg-white border rounded-2xl px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
            <p className="text-sm text-gray-600">You have unsaved changes.</p>

            <div className="flex items-center gap-3 w-full sm:w-auto">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={saving}
                    className="flex-1 sm:flex-none"
                >
                    Cancel
                </Button>

                <Button
                    type="submit"
                    onClick={onSave}
                    loading={saving}
                    leftIcon={<Save size={16} />}
                    className="flex-1 sm:flex-none"
                >
                    Save Changes
                </Button>
            </div>
        </div>
    );
}
