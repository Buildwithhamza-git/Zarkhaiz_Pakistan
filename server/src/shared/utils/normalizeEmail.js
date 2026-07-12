const normalizeEmail = (email) => {
    if (!email) return email;

    email = email.trim().toLowerCase();

    const [local, domain] = email.split("@");

    if (domain === "gmail.com") {
        return `${local.split("+")[0].replace(/\./g, "")}@gmail.com`;
    }

    return email;
};

module.exports = {
    normalizeEmail,
};