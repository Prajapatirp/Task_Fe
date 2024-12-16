import React, { useEffect, useState } from "react";
import { addTask, deleteTask, editTask, listOfTask } from "./api/taskApi";
import { toast } from "react-toastify";
function App() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "",
  });
  const [errors, setErrors] = useState({});
  const [editingIndex, setEditingIndex] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");

  let header = [
    {
      label: "title",
    },
    {
      label: "description",
    },
    {
      label: "status",
    },
    {
      label: "action",
    },
  ];

  const [listData, setListData] = useState([]);

  const filter = (status) => {
    let obj = {};
    if (status) {
      obj = {
        status,
      };
    }
    listOfTask(obj)
      .then((response) => {
        setListData(response?.data);
      })
      .catch((err) => {
        return err;
      })
      .finally(() => {});
  };

  useEffect(() => {
    filter();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = "Title is required";
    if (!formData.description)
      newErrors.description = "Description is required";
    if (!formData.status) newErrors.status = "Status is required";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (editingIndex !== null) {
      console.log("updatedList", formData);

      const id = formData._id;
      editTask(id, formData)
        .then((res) => {
          if (res?.data?.status === "Success") {
            filter();
            toast.success(res?.data?.message);
          } else {
            toast.error(res?.data?.message);
          }
        })
        .catch((err) => {
          return err;
        });

      setEditingIndex(null);
    } else {
      addTask(formData)
        .then((res) => {
          if (res?.data?.status === "Success") {
            filter();
            toast.success(res?.data?.message);
          } else {
            toast.error(res?.data?.message);
          }
        })
        .catch((err) => {
          return err;
        });
    }

    setFormData({ title: "", description: "", status: "" });
    setErrors({});
  };

  const handleEdit = (index) => {
    setFormData(listData[index]);
    setEditingIndex(index);
  };

  const handleDelete = (index) => {
    const id = index._id
    deleteTask(id).then((res) => {
      if (res?.data?.status === "Success") {
        filter();
        toast.success(res?.data?.message);
      } else {
        toast.error(res?.data?.message);
      }
    }).catch()
    setListData(listData.filter((_, i) => i !== index));
  };

  const handleFilterChange = (e) => {
    filter(e.target.value);
    setFilterStatus(e.target.value);
  };

  return (
    <div className="min-h-screen bg-[#F6F5FF]">
      <div className="flex justify-center">
        <div className="w-[350px] p-6 my-5 bg-white border border-gray-200 rounded-lg shadow lg:mx-0 md:mx-0 sm:mx-0 mx-5">
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="relative z-0 w-full mb-5 group">
              <input
                onChange={handleInputChange}
                type="text"
                name="title"
                value={formData.title}
                id="title"
                className={`block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 ${
                  errors.title ? "border-red-500" : "border-gray-300"
                } appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer`}
                placeholder=" "
              />
              <label
                htmlFor="title"
                className="peer-focus:font-medium absolute text-sm text-gray-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                Title
              </label>
              {errors.title && (
                <p className="text-red-500 text-xs">{errors.title}</p>
              )}
            </div>
            <div className="relative z-0 w-full mb-5 group">
              <textarea
                onChange={handleInputChange}
                rows="3"
                name="description"
                value={formData.description}
                id="description"
                className={`block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 ${
                  errors.description ? "border-red-500" : "border-gray-300"
                } appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer`}
                placeholder=" "
              />
              <label
                htmlFor="description"
                className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                Description
              </label>
              {errors.description && (
                <p className="text-red-500 text-xs">{errors.description}</p>
              )}
            </div>
            <div className="relative z-0 w-full mb-5 group">
              <label htmlFor="select_status" className="sr-only">
                Underline select
              </label>
              <select
                onChange={handleInputChange}
                id="select_status"
                name="status"
                value={formData.status}
                className={`block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 ${
                  errors.status ? "border-red-500" : "border-gray-300"
                } appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer`}>
                <option defaultValue={"Select Status"} disabled>
                  Select Status
                </option>
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
              {errors.status && (
                <p className="text-red-500 text-xs">{errors.status}</p>
              )}
            </div>
            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">
              Submit
            </button>
          </form>
        </div>
      </div>
      <div className="lg:px-6 md:px-6 sm:px-3 px-1">
        <div className="grid grid-cols-12">
          <div className="lg:col-span-2 md:col-span-2 sm:col-span-1 col-span-0" />
          <div className="lg:col-span-8 md:col-span-8 sm:col-span-10 col-span-12 lg:mx-0 md:mx-0 sm:mx-0 mx-5 mb-5">
            <div className="px-0 pb-0 bg-white border border-gray-200 rounded-lg shadow overflow-x-auto">
              <div className="flex items-center my-3 mx-2">
                <label
                  htmlFor="small"
                  className="block mb-2 text-sm font-medium text-gray-900 me-2">
                  Filter :
                </label>
                <select
                  onChange={handleFilterChange}
                  value={filterStatus}
                  id="small"
                  className="block p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500">
                  <option value="All">All</option>
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </select>
              </div>
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
                <thead className="text-xs text-gray-700 uppercase bg-[#C3DDFD]">
                  <tr>
                    {header.map((header) => (
                      <th key={header.label} scope="col" className="px-6 py-3">
                        {header.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {listData.map((item, index) => (
                    <tr
                      key={index}
                      className="bg-white border-b hover:bg-[#e6f2ff]">
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                        {item.title}
                      </th>
                      <td className="px-6 py-4">{item.description}</td>
                      <td className="px-6 py-4">{item.status}</td>
                      <td className="flex items-center px-6 py-4">
                        <a
                          href="#"
                          onClick={() => handleEdit(index)}
                          className="font-medium text-blue-600 hover:underline">
                          Edit
                        </a>
                        <a
                          href="#"
                          onClick={() => handleDelete(item)}
                          className="font-medium text-red-600 hover:underline ms-3">
                          Remove
                        </a>
                      </td>
                    </tr>
                  ))}
                  {listData.length === 0 && (
                    <tr>
                      <td colSpan={4} className="text-center py-4">
                        No tasks found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className="lg:col-span-2 md:col-span-2 sm:col-span-1 col-span-0" />
        </div>
      </div>
    </div>
  );
}

export default App;
