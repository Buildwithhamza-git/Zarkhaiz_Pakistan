import UploadCard from "./UploadCard";
import Button from "../../../../shared/components/ui/button";

export default function DocumentsUpload({

    formData,

    setFormData,

    nextStep,

    previousStep,

}) {

    const updateFile = (name, file) => {

        setFormData({

            ...formData,

            documents: {

                ...formData.documents,

                [name]: file,

            },

        });

    };

    return (

        <div>

            <h2 className="text-2xl font-bold text-green-800">

                Upload Documents

            </h2>

            <p className="text-gray-500 mt-2">

                Upload required documents for seller verification.

            </p>

            <div className="grid md:grid-cols-2 gap-8 mt-8">

                <UploadCard
                    title="CNIC Front"
                    file={formData.documents.cnicFront}
                    onChange={(e) =>
                        updateFile(
                            "cnicFront",
                            e.target.files[0]
                        )
                    }
                    onRemove={() =>
                        updateFile("cnicFront", null)
                    }
                />

                <UploadCard
                    title="CNIC Back"
                    file={formData.documents.cnicBack}
                    onChange={(e) =>
                        updateFile(
                            "cnicBack",
                            e.target.files[0]
                        )
                    }
                    onRemove={() =>
                        updateFile("cnicBack", null)
                    }
                />
            </div>

            <div className="flex justify-between mt-10">

                <Button
                    variant="outline"
                    onClick={previousStep}
                >
                    ← Previous
                </Button>

                <Button onClick={nextStep}>
                    Next →
                </Button>

            </div>

        </div>

    );

}   