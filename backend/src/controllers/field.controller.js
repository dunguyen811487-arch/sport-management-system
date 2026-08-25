const fieldService =
    require("../services/field.service");


// ======================================================
// CREATE
// ======================================================

const createField = async (
    req,
    res
) => {

    try {

        const data = {
            ...req.body
        };


        // ----------------------------------------------
        // IMAGE
        // ----------------------------------------------

        if (req.file) {

            data.image =
                `/uploads/fields/${req.file.filename}`;

        }


        // ----------------------------------------------
        // ÉP KIỂU
        // ----------------------------------------------

        if (
            data.pricePerHour !== undefined &&
            data.pricePerHour !== ""
        ) {

            data.pricePerHour =
                Number(
                    data.pricePerHour
                );

        }


        const field =
            await fieldService.createField(
                data
            );


        return res.status(201).json({
            success: true,
            message:
                "Tạo sân thành công",
            data: field
        });

    } catch (error) {

        console.error(
            "Create field error:",
            error
        );


        return res.status(400).json({
            success: false,
            message:
                error.message
        });
    }
};


// ======================================================
// GET ALL
// ======================================================

const getAllFields = async (
    req,
    res
) => {

    try {

        const fields =
            await fieldService.getAllFields();


        return res.status(200).json(
            fields
        );

    } catch (error) {

        console.error(
            "Get all fields error:",
            error
        );


        return res.status(500).json({
            success: false,
            message:
                error.message
        });
    }
};


// ======================================================
// GET BY ID
// ======================================================

const getFieldById = async (
    req,
    res
) => {

    try {

        const field =
            await fieldService.getFieldById(
                req.params.id
            );


        if (!field) {

            return res.status(404).json({
                success: false,
                message:
                    "Không tìm thấy sân"
            });
        }


        return res.status(200).json(
            field
        );

    } catch (error) {

        console.error(
            "Get field by id error:",
            error
        );


        return res.status(500).json({
            success: false,
            message:
                error.message
        });
    }
};


// ======================================================
// UPDATE
// ======================================================

const updateField = async (
    req,
    res
) => {

    try {

        const data = {
            ...req.body
        };


        // ----------------------------------------------
        // IMAGE
        // ----------------------------------------------

        if (req.file) {

            data.image =
                `/uploads/fields/${req.file.filename}`;

        }


        // ----------------------------------------------
        // PRICE
        // ----------------------------------------------

        if (
            data.pricePerHour !== undefined &&
            data.pricePerHour !== ""
        ) {

            data.pricePerHour =
                Number(
                    data.pricePerHour
                );

        }


        // ----------------------------------------------
        // UPDATE
        // ----------------------------------------------

        const field =
            await fieldService.updateField(
                req.params.id,
                data
            );


        if (!field) {

            return res.status(404).json({
                success: false,
                message:
                    "Không tìm thấy sân"
            });
        }


        return res.status(200).json({
            success: true,
            message:
                "Cập nhật sân thành công",
            data: field
        });

    } catch (error) {

        console.error(
            "Update field error:",
            error
        );


        return res.status(400).json({
            success: false,
            message:
                error.message
        });
    }
};


// ======================================================
// DELETE
// ======================================================

const deleteField = async (
    req,
    res
) => {

    try {

        const field =
            await fieldService.deleteField(
                req.params.id
            );


        if (!field) {

            return res.status(404).json({
                success: false,
                message:
                    "Không tìm thấy sân"
            });
        }


        return res.status(200).json({
            success: true,
            message:
                "Xóa sân thành công",
            data: field
        });

    } catch (error) {

        console.error(
            "Delete field error:",
            error
        );


        return res.status(400).json({
            success: false,
            message:
                error.message
        });
    }
};


module.exports = {
    createField,
    getAllFields,
    getFieldById,
    updateField,
    deleteField
};