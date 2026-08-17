const Field =
    require("../models/field.model");

const Booking =
    require("../models/booking.model");


// ======================================================
// CREATE
// ======================================================

const createField = async (
    data
) => {

    // ----------------------------------------------
    // Giá mặc định
    // ----------------------------------------------

    if (
        data.pricePerHour === undefined ||
        data.pricePerHour === null ||
        data.pricePerHour === ""
    ) {

        data.pricePerHour = 0;
    }


    // ----------------------------------------------
    // Status mặc định
    // ----------------------------------------------

    if (!data.status) {

        data.status = "active";
    }


    return await Field.create(
        data
    );
};


// ======================================================
// GET ALL
// ======================================================

const getAllFields = async () => {

    return await Field
        .find()
        .populate("fieldTypeId")
        .sort({
            createdAt: -1
        });
};


// ======================================================
// GET BY ID
// ======================================================

const getFieldById = async (
    id
) => {

    return await Field
        .findById(id)
        .populate("fieldTypeId");
};


// ======================================================
// UPDATE
// ======================================================

const updateField = async (
    id,
    data
) => {

    // ----------------------------------------------
    // Kiểm tra sân
    // ----------------------------------------------

    const existingField =
        await Field.findById(id);


    if (!existingField) {
        return null;
    }


    // ----------------------------------------------
    // Chỉ cho status hợp lệ
    // ----------------------------------------------

    if (data.status) {

        const validStatuses = [
            "active",
            "maintenance"
        ];


        if (
            !validStatuses.includes(
                data.status
            )
        ) {

            throw new Error(
                "Trạng thái sân không hợp lệ"
            );
        }
    }


    // ----------------------------------------------
    // Không cho thay đổi rating trực tiếp
    // nếu frontend gửi lên
    // ----------------------------------------------

    delete data.rating;


    // ----------------------------------------------
    // Không cho đổi _id
    // ----------------------------------------------

    delete data._id;


    // ----------------------------------------------
    // Update
    // ----------------------------------------------

    return await Field.findByIdAndUpdate(
        id,
        data,
        {
            new: true,
            runValidators: true
        }
    ).populate(
        "fieldTypeId"
    );
};


// ======================================================
// DELETE
// ======================================================

const deleteField = async (
    id
) => {

    // ----------------------------------------------
    // Kiểm tra sân
    // ----------------------------------------------

    const field =
        await Field.findById(id);


    if (!field) {
        return null;
    }


    // ----------------------------------------------
    // Kiểm tra booking
    // ----------------------------------------------

    const bookingCount =
        await Booking.countDocuments({
            fieldId: id
        });


    if (bookingCount > 0) {

        throw new Error(
            "Không thể xóa sân vì sân đã có lịch đặt. Hãy chuyển sân sang trạng thái bảo trì."
        );
    }


    // ----------------------------------------------
    // Xóa
    // ----------------------------------------------

    return await Field.findByIdAndDelete(
        id
    );
};


module.exports = {
    createField,
    getAllFields,
    getFieldById,
    updateField,
    deleteField
};