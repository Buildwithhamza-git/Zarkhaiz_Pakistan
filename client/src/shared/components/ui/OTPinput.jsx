import { useRef } from "react";

export default function OTPInput({
    value,
    onChange,
    length = 6,
}) {
    const inputRefs = useRef([]);

    const handleChange = (index, e) => {
        const input = e.target.value;

        if (!/^\d*$/.test(input)) return;

        const otp = value.split("");

        otp[index] = input.slice(-1);

        onChange(otp.join(""));

        if (input && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (
            e.key === "Backspace" &&
            !value[index] &&
            index > 0
        ) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();

        const pasted = e.clipboardData
            .getData("text")
            .replace(/\D/g, "")
            .slice(0, length);

        onChange(pasted);

        if (pasted.length === length) {
            inputRefs.current[length - 1]?.focus();
        }
    };

    return (
        <div className="flex justify-center gap-3">
            {Array.from({ length }).map((_, index) => (
                <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={value[index] || ""}
                    onChange={(e) => handleChange(index, e)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className="
                        w-14
                        h-14
                        rounded-xl
                        border-2
                        border-green-200
                        text-center
                        text-2xl
                        font-bold
                        outline-none
                        transition
                        focus:border-green-600
                        focus:ring-4
                        focus:ring-green-200
                    "
                />
            ))}
        </div>
    );
}