import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import fieldService from "../../services/fieldService";
import formatCurrency from "../../utils/formatCurrency";

import FieldDetail from "./FieldDetail";

import "../../assets/styles/field-list.css";


function FieldList() {

  const navigate = useNavigate();


  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedField, setSelectedField] = useState(null);

  const [search, setSearch] = useState("");
  const [fieldType, setFieldType] = useState("all");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("default");



  useEffect(() => {

    loadFields();

  }, []);



  const loadFields = async () => {

    try {


      /*
      const response = await fieldService.getFields();
      setFields(response.data);
      */


      setFields([

        {
          _id:"1",
          fieldName:"Sân bóng đá A",
          fieldType:"Bóng đá",
          subType:"Sân 7 người",
          location:"Khu A",
          pricePerHour:250000,
          rating:4.9,
          image:"https://images.unsplash.com/photo-1547347298-4074fc3086f0?w=900",
          description:"Sân cỏ nhân tạo đạt chuẩn FIFA.",
          status:"active"
        },


        {
          _id:"2",
          fieldName:"Sân bóng đá B",
          fieldType:"Bóng đá",
          subType:"Sân 5 người",
          location:"Khu A",
          pricePerHour:180000,
          rating:4.8,
          image:"https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=900",
          description:"Có đèn LED ban đêm.",
          status:"active"
        },


        {
          _id:"3",
          fieldName:"Sân cầu lông 01",
          fieldType:"Cầu lông",
          subType:"Sân tiêu chuẩn",
          location:"Khu B",
          pricePerHour:80000,
          rating:4.8,
          image:"https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=900",
          description:"Sàn PVC chống trơn.",
          status:"active"
        },


        {
          _id:"4",
          fieldName:"Sân cầu lông 02",
          fieldType:"Cầu lông",
          subType:"Sân tiêu chuẩn",
          location:"Khu B",
          pricePerHour:85000,
          rating:4.9,
          image:"https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=900",
          description:"Có máy lạnh.",
          status:"active"
        },


        {
          _id:"5",
          fieldName:"Sân Pickleball 01",
          fieldType:"Pickleball",
          subType:"Ngoài trời",
          location:"Khu C",
          pricePerHour:120000,
          rating:4.9,
          image:"https://images.unsplash.com/photo-1666811094885-9eb97d0dbb75?w=900",
          description:"Mặt sân Acrylic.",
          status:"active"
        },


        {
          _id:"6",
          fieldName:"Sân Pickleball 02",
          fieldType:"Pickleball",
          subType:"Ngoài trời",
          location:"Khu C",
          pricePerHour:120000,
          rating:4.8,
          image:"https://images.unsplash.com/photo-1666811094885-9eb97d0dbb75?w=900",
          description:"Có khu nghỉ.",
          status:"active"
        },


        {
          _id:"7",
          fieldName:"Sân bóng chuyền 01",
          fieldType:"Bóng chuyền",
          subType:"Trong nhà",
          location:"Khu D",
          pricePerHour:150000,
          rating:4.7,
          image:"https://images.unsplash.com/photo-1517649763962-0c623066013b?w=900",
          description:"Sân thi đấu tiêu chuẩn.",
          status:"active"
        },


        {
          _id:"8",
          fieldName:"Sân bóng chuyền 02",
          fieldType:"Bóng chuyền",
          subType:"Trong nhà",
          location:"Khu D",
          pricePerHour:150000,
          rating:4.8,
          image:"https://images.unsplash.com/photo-1517649763962-0c623066013b?w=900",
          description:"Có khán đài.",
          status:"maintenance"
        }

      ]);



    } catch(error){

      console.log(error);

    } finally {

      setLoading(false);

    }

  };



  const filteredFields = useMemo(()=>{


    let result=[...fields];


    result=result.filter(field=>
      field.fieldName
      .toLowerCase()
      .includes(search.toLowerCase())
    );


    if(fieldType!=="all"){

      result=result.filter(
        field=>field.fieldType===fieldType
      );

    }


    if(status!=="all"){

      result=result.filter(
        field=>field.status===status
      );

    }



    switch(sort){

      case "priceAsc":

        result.sort(
          (a,b)=>a.pricePerHour-b.pricePerHour
        );

        break;


      case "priceDesc":

        result.sort(
          (a,b)=>b.pricePerHour-a.pricePerHour
        );

        break;


      case "rating":

        result.sort(
          (a,b)=>b.rating-a.rating
        );

        break;


      default:
        break;

    }


    return result;


  },[
    fields,
    search,
    fieldType,
    status,
    sort
  ]);



  const sportGroups={

    "Bóng đá":
      filteredFields.filter(
        f=>f.fieldType==="Bóng đá"
      ),

    "Cầu lông":
      filteredFields.filter(
        f=>f.fieldType==="Cầu lông"
      ),

    "Pickleball":
      filteredFields.filter(
        f=>f.fieldType==="Pickleball"
      ),

    "Bóng chuyền":
      filteredFields.filter(
        f=>f.fieldType==="Bóng chuyền"
      )

  };


const openFieldDetail = (field) => {

    setSelectedField(field);

};


  const bookingField = (field) => {

  navigate("/booking", {
    state: {
      field,
    },
  });

};



  if(loading){

    return(

      <div className="container py-5 text-center">

        <div className="spinner-border text-success"></div>

        <p className="mt-3">
          Đang tải danh sách sân...
        </p>

      </div>

    );

  }
    return (
    <div className="container-fluid py-4">


      {/* ================= Banner ================= */}

      <div className="field-banner mb-4">

        <div>

          <h2>
            🏟️ Danh sách sân thể thao
          </h2>

          <p>
            Khu liên hợp thể thao gồm sân bóng đá,
            cầu lông, pickleball và bóng chuyền.
          </p>

        </div>

      </div>



      {/* ================= Bộ lọc ================= */}

      <div className="card shadow-sm border-0 mb-4">

        <div className="card-body">

          <div className="row g-3">


            {/* Tìm kiếm */}

            <div className="col-lg-4">

              <input
                type="text"
                className="form-control"
                placeholder="🔍 Tìm tên sân..."
                value={search}
                onChange={(e)=>setSearch(e.target.value)}
              />

            </div>



            {/* Loại sân */}

            <div className="col-lg-3">

              <select
                className="form-select"
                value={fieldType}
                onChange={(e)=>setFieldType(e.target.value)}
              >

                <option value="all">
                  Tất cả môn thể thao
                </option>


                <option value="Bóng đá">
                  ⚽ Bóng đá
                </option>


                <option value="Cầu lông">
                  🏸 Cầu lông
                </option>


                <option value="Pickleball">
                  🏓 Pickleball
                </option>


                <option value="Bóng chuyền">
                  🏐 Bóng chuyền
                </option>


              </select>

            </div>



            {/* Trạng thái */}

            <div className="col-lg-2">

              <select
                className="form-select"
                value={status}
                onChange={(e)=>setStatus(e.target.value)}
              >

                <option value="all">
                  Tất cả
                </option>


                <option value="active">
                  Đang hoạt động
                </option>


                <option value="maintenance">
                  Bảo trì
                </option>


              </select>

            </div>




            {/* Sắp xếp */}

            <div className="col-lg-3">

              <select
                className="form-select"
                value={sort}
                onChange={(e)=>setSort(e.target.value)}
              >

                <option value="default">
                  Sắp xếp
                </option>


                <option value="priceAsc">
                  Giá tăng dần
                </option>


                <option value="priceDesc">
                  Giá giảm dần
                </option>


                <option value="rating">
                  Đánh giá cao nhất
                </option>


              </select>


            </div>


          </div>

        </div>

      </div>





      {/* ================= Danh sách sân ================= */}



      {
        Object.entries(sportGroups).map(
          ([sport, fields]) => (


          <div 
            className="mb-5"
            key={sport}
          >


            <h3 className="sport-title">

              {
                sport==="Bóng đá"
                ? "⚽"
                : sport==="Cầu lông"
                ? "🏸"
                : sport==="Pickleball"
                ? "🏓"
                : "🏐"
              }

              {" "}

              {sport}

            </h3>



            <div className="row g-4">


              {
                fields.length===0 ? (


                  <div className="col-12">

                    <p className="text-muted">
                      Không có sân nào.
                    </p>

                  </div>


                )

                :

                (


                  fields.map(field=>(


                    <div
                      className="col-lg-6"
                      key={field._id}
                    >



                      <div
                          className="card field-card shadow-sm border-0"
                          onClick={() => openFieldDetail(field)}
                          style={{ cursor: "pointer" }}
                      >



                        <img

                          src={field.image}

                          className="field-image"

                          alt={field.fieldName}

                        />



                        <div className="card-body">



                          <div className="d-flex justify-content-between">


                            <h5>

                              {field.fieldName}

                            </h5>


                            <span>

                              ⭐ {field.rating}

                            </span>


                          </div>





                          <p className="text-muted">

                            📍 {field.location}

                          </p>





                          <p>

                            Loại:
                            {" "}
                            {field.subType}

                          </p>





                          <h5 className="field-price">

                            {formatCurrency(
                              field.pricePerHour
                            )}

                            /giờ

                          </h5>





                          {

                            field.status==="active"

                            ?

                            <span className="badge bg-success">

                              Đang hoạt động

                            </span>


                            :

                            <span className="badge bg-danger">

                              Đang bảo trì

                            </span>


                          }




                          <div className="d-flex gap-2 mt-3">


                            <button

                              className="btn btn-outline-success flex-fill"

                              onClick={()=>
                                openFieldDetail(field)
                              }

                            >

                              Chi tiết

                            </button>





                            <button

                              className="btn btn-success flex-fill"

                              disabled={
                                field.status!=="active"
                              }

                              onClick={()=>
                                bookingField(field)
                              }

                            >

                              Đặt sân

                            </button>



                          </div>



                        </div>



                      </div>



                    </div>


                  ))

                )

              }



            </div>



          </div>


        ))

      }
      
       <FieldDetail

        field={selectedField}

        onClose={() =>
          setSelectedField(null)
        }

        onBooking={bookingField}

      />
    </div>
      
  );
}


export default FieldList;