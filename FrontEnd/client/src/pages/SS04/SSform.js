import React, { useState,useEffect } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Header from '../../components/Navbar/Header';
import { Input } from "@nextui-org/react";
import "./ssform.css";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import globalUrl from "../../components/url";
import {data} from "./data"

const SS04form = () => {
  const [tabledata, setTabledata] = useState([]);
  const navigate = useNavigate();
  const [search,setSearch]=useState('');
  const [searchdrop,setSearchdrop]=useState('');
  const [selectedUserName, setSelectedUserName] = useState('');

  const addRow = (e) => {
    e.preventDefault();
    // Create a new row with a unique ID and serial number
    const newRow = { id: tabledata.length + 1, sno: tabledata.length + 1 };
    // Update the state to include the new row
    setTabledata([...tabledata, newRow]);
  };

  const [userData,setUserData]=useState({})
  const [error,setError]=useState({})
  const [formData, setFormData] = useState({
    StoreNo: "",
    financialyear: "",
    reqdate: "",
    custodian: "",
    department: "",
    location: "",
    contact: "",
    items_receiving_date: "",
    designation: "",
    inventory_no: "",
    room_no: "",
    email: "",
    total_amount: "",
    list_order: [],
    name_indenter: "",
    sign_date_indenter: "",
    name_head: "",
    sign_date_head: "",
   issued_approved_name:"",
   issued_approved_date:"", // Assuming the date could be null
   items_received_name:"" ,
   items_received_date:"" ,
   items_issued_name: "",
   items_issued_date:"", // Assuming the date could be null
   action_ledger_name:"", 
   action_ledger_date:"",  // Assuming the date could be null
   form_to_id:"",


  });

  const handleUserSelect = (userId,userName) => {
    setFormData({
      ...formData,
      form_to_id: userId
    });
    setSelectedUserName(userName); // Set the selected user's name
    setSearch(''); // Clear the search input
  };

  const handleCustodianChange = (event) => {
    const newFormData = { ...formData, custodian: event.target.value };
    // Assuming you're using the JavaScript Date object
    const currentDate = new Date();
    const formattedDate = `${currentDate.getFullYear()}/${currentDate.getMonth() + 1}/${currentDate.getDate()}`;
    newFormData.name_indenter = event.target.value; // Assigning custodian's value to name_indenter
    newFormData.sign_date_indenter = formattedDate; // Assigning current date to sign_date_indenter

    newFormData.name_head = "";
    newFormData.sign_date_head = "";
    setFormData(newFormData);
  };

  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setFormData({ ...formData, designation: option }); // Update designation field with selected option
    setShowDropdown(false);
  };

  const handleChange = (evt) => {
    const changedField = evt.target.name;
    const newValue = evt.target.value;

    setFormData((currData) => {
      currData[changedField] = newValue;
      return {
        ...currData,
      };
    });
  };

  const handleChangeTable = (event, index, key) => {
    const { value } = event.target;
    const updatedListOrders = [...tabledata];
    updatedListOrders[index][key] = value;
    setTabledata(updatedListOrders);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const listOrders = tabledata.map(row => ({
      supplier: row.supplier,
      bill: row.bill,
      and_date: row.and_date,
      item: row.item,
      quantity: row.quantity,
      con_n_con: row.con_n_con,
      unit_price: row.unit_price,
      total: row.total
    }));

    const updatedFormData = { ...formData, list_order: listOrders };
    console.log("update form data:", updatedFormData)

    try {
      const response = await axios.post(`${globalUrl}/v1/submit/SS04`, updatedFormData);
      const { id } = response.data;
      navigate(`/SS04/${id}`);
      console.log("Response from server:", response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${globalUrl}/list/receiver`);
        // const response = await axios.get(`https://randomuser.me/api/`);
        setUserData(response.data);
        console.log(response.data)
      } catch (error) {
        setError(error);
      } finally {
        // setLoading(false);
      }
    };

    fetchData();

  
    return () => {
      
    };
  }, []); 



  return (
    <div>
      <Navbar />
      <Header />
      {/* <div></div> */}
      <div className='ml-56 border-2 border-black h-full'>
        <form>
          <div className='flex w-full p-4 '>
            <div className='w-2/3'>IITI logo and header left</div>
            <div>
              <div className=' border-2 border-black'>
                <div className='flex-col p-4'>
                  <h2>FORM NO:SS04</h2>
                  <table>
                    <thead>
                      <tr>
                        {/* Table headers */}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <label htmlFor="StoreNo">Store Number/IN/IV/DP/NO. : </label>
                        </td>
                        <td>
                          <input type="text" id="StoreNo" name="StoreNo" placeholder="Store No" value={formData.StoreNo} onChange={handleChange} className="border-2 border-black" />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <label htmlFor="financialyear">Financial year : </label>
                        </td>
                        <td>
                          <input type="number" id="financialyear" name="financialyear" placeholder='financialyear' value={formData.financialyear} onChange={handleChange} className="border-2 border-black" />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <label htmlFor="reqdate">Date : </label>
                        </td>
                        <td>
                          <input type="date" id="reqdate" name="reqdate" value={formData.reqdate} onChange={handleChange} className="border-2 border-black" />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <p>(to be filled by store assistant)</p>
                </div>
              </div>

            </div>
          </div>
          <div className=' w-full px-4 py-2  '>
            <span className='flex justify'>
              <span className='mx-auto'>(To be prepared in duplicate. One copy will be forwarded to Finance, and one held with Store Office.)</span>
            </span>
            {/* <div className='flex w-full px-4 py-2  border-4 border-red-300'> */}
            <div className='flex w-full px-4 py-2  '>
              <div className='flex-col w-1/2 px-12'>
                <table>
                  <tbody>
                    <tr>
                      <td><label className='font-bold' htmlFor="custodian">Name of custodian of assets :</label></td>
                      <td>
                        {/* <!-- <span>Dr. Nisheeth K. Prasad</span> --> */}
                        <input type="text" id="custodian" name="custodian" value={formData.custodian} placeholder='custodian name' onChange={handleCustodianChange} className="border-2 border-black" /></td>
                    </tr>
                    <tr>
                      <td><label className='font-bold' htmlFor="department">Department/Project No. :</label></td>
                      <td>
                        {/* <!-- <span>MEMS</span> --> */}
                        <input type="text" id="department" name="department" value={formData.department} placeholder='department name' onChange={handleChange} className="border-2 border-black" /></td>
                    </tr>
                    <tr>
                      <td><label className='font-bold' htmlFor="location">Location :</label></td>
                      <td><input type="text" id="location" name="location" placeholder='location' value={formData.location} onChange={handleChange} className="border-2 border-black" /></td>
                    </tr>
                    <tr>
                      <td><label className='font-bold' htmlFor="contact">Contact No :</label></td>
                      <td><input type="number" id="contact" name="contact" placeholder='contact' value={formData.contact} onChange={handleChange} className="border-2 border-black" /></td>
                    </tr>
                    <tr>
                      <td><label className='font-bold' htmlFor="items_receiving_date">Item Receiving Date: </label></td>
                      <td><input type="date" id="items_receiving_date" name="items_receiving_date" placeholder='date' value={formData.items_receiving_date} onChange={handleChange} className="border-2 border-black" /></td>
                    </tr>
                  </tbody>
                </table>

              </div>
              <div className='flex-col w-1/2 px-12'>
                <table>
                  <thead>
                    <tr>
                      {/* Table headers */}
                      {/* Fill the Info */}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><label className='font-bold' htmlFor='designation'>Designation :</label></td>
                      <td><input type="text" id="designation" name="designation" placeholder='designation' value={formData.designation} onChange={handleChange} className="border-2 border-black" /></td>
                    </tr>
                    <tr>
                      <td><label for="inventory_no" htmlFor='inventory_no'>Inventory No :</label></td>
                      <td><input type="number" id="inventory_no" name="inventory_no" value={formData.inventory_no} onChange={handleChange} class="border-2 border-black" /></td>
                    </tr>
                    <tr>
                      <td><label className='font-bold' htmlFor='room_no'>Room No :</label></td>
                      <td><input type="text" id="room_no" name="room_no" placeholder='room number' value={formData.room_no} onChange={handleChange} className="border-2 border-black" /></td>
                    </tr>
                    <tr>
                      <td><label className='font-bold' htmlFor='email'>Email id :</label></td>
                      <td><input type="email" id="email" name="email" placeholder='email' value={formData.email} onChange={handleChange} className="border-2 border-black" /></td>
                    </tr>
                  </tbody>
                </table>


              </div>
            </div>
            <span className='flex justify'>
              <span className='mx-auto '>If Item purchased under buy-back (No) & Item purchase information GeM Contract No.: DP</span>

            </span>

          </div>
          <div className='p-4 ' style={{ overflowX: 'auto' }}>
            {/* <h1>Dynamic Table</h1> */}
            <table>
              <thead>
                <tr>
                  <th>Sno</th>
                  <th>Name of Supplier </th>
                  <th>Bill No</th>
                  <th>Date</th>
                  <th>Item Name and Specification</th>
                  <th>Qty</th>
                  <th>Con/Non-Con</th>
                  <th>Unit Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {tabledata.map((row, index) => (
                  <tr key={index}>
                    <td>{row.sno}</td>
                    <td><input type="text" id={`supplier_${index}`} name={`supplier_${index}`} value={row.supplier} onChange={(e) => handleChangeTable(e, index, 'supplier')} placeholder="Supplier Name" className="border-2 border-black" /></td>
                    <td><input type="text" id={`bill${index}`} name={`bill${index}`} value={row.bill} onChange={(e) => handleChangeTable(e, index, 'bill')} placeholder="Bill No & Date" className="border-2 border-black" /></td>
                    <td><input type="text" id={`and_date_${index}`} name={`and_date_${index}`} value={row.and_date} onChange={(e) => handleChangeTable(e, index, 'and_date')} placeholder="and_date No & Date" className="border-2 border-black" /></td>
                    <td><input type="text" id={`item_${index}`} name={`item_${index}`} value={row.item} onChange={(e) => handleChangeTable(e, index, 'item')} placeholder="Item Name and Specification" className="border-2 border-black" /></td>
                    <td><input type="text" id={`quantity_${index}`} name={`quantity_${index}`} value={row.quantity} onChange={(e) => handleChangeTable(e, index, 'quantity')} placeholder="Qty" className="border-2 border-black" /></td>
                    <td><input type="text" id={`con_n_con_${index}`} name={`con_n_con_${index}`} value={row.con_n_con} onChange={(e) => handleChangeTable(e, index, 'con_n_con')} placeholder="Con/Non-Con" className="border-2 border-black" /></td>
                    <td><input type="text" id={`unit_price_${index}`} name={`unit_price_${index}`} value={row.unit_price} onChange={(e) => handleChangeTable(e, index, 'unit_price')} placeholder="Unit Price" className="border-2 border-black" /></td>
                    <td><input type="text" id={`total_${index}`} name={`total_${index}`} value={row.total} onChange={(e) => handleChangeTable(e, index, 'total')} placeholder="Total" className="border-2 border-black" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className='flex w-full gap-80 '>
              <div className='w-1/2 p-4'>
                <p className='text-2xl'>Total Amount (incl. 18% GST) :	<input type="number" id="total_amount" name="total_amount" value={formData.total_amount} onChange={handleChange} className="border-2 border-black" /></p>
              </div>
              <div>
                <button onClick={addRow}>Add Row</button></div>
            </div>
          </div>



          <div className='py-8 flex-col w-full p-4'>
            {/* Signatures section left */}
            <div className='flex flex-col gap-4'>
              <div className='flex flex-row justify-center'>
                <h2 className='text-2xl font-semibold underline decoration-solid'>CERTIFICATION BY USER DEPARTMENT</h2>
              </div>
              <p>1.	Certified that the items mentioned in the form have been inspected and found acceptable by the undersigned in accordance with the quality and quantity and specification(s) and price. </p>
              <p>2.	A demand for goods is not divided into small quantities to make piecemeal purchases to avoid the necessity of obtaining the sanction of higher authority required with reference to the estimated value of the total demand (As per GFR 2017 Rule No. 157)</p>
            </div>
            {/* <div className='flex flex-row '>
              <div>

              </div>
              <div></div>
            </div> */}
          </div>
          <div className='flex flex-wrap w-full px-4 py-2  '>
            <div className='flex-col w-1/2 px-12 py-12'>
              <div className='flex flex-row justify-center text-xl font-semibold'>
                <h2>Issue Approved</h2>
              </div>
              <table>
                <tbody>
                  <tr>
                    <td><label className='font-bold' htmlFor="issued_approved_name">Name :</label></td>
                    <td>
                      {/* <!-- <span>Dr. Nisheeth K. Prasad</span> --> */}
                      <input type="text" id="issued_approved_name" name="issued_approved_name" value={formData.issued_approved_name} placeholder='issued_approved_name ' onChange={handleCustodianChange} className="border-2 border-black" /></td>
                  </tr>
                  <tr>
                    <td><label className='font-bold' htmlFor="issued_approved_date">Date :</label></td>
                    <td>
                      {/* <!-- <span>MEMS</span> --> */}
                      <input type="text" id="issued_approved_date" name="issued_approved_date" value={formData.issued_approved_date} placeholder='issued_approved_date ' onChange={handleChange} className="border-2 border-black" /></td>
                  </tr>
                 
                </tbody>
              </table>

            </div>
            <div className='flex-col w-1/2 px-12 py-12'>
              <div className='flex flex-row justify-center text-xl font-semibold'>
                <h2>Items Recieved</h2>
              </div>
              <table>
                <tbody>
                  <tr>
                    <td><label className='font-bold' htmlFor="items_received_name">Name:</label></td>
                    <td>
                      {/* <!-- <span>Dr. Nisheeth K. Prasad</span> --> */}
                      <input type="text" id="items_received_name" name="items_received_name" value={formData.items_received_name} placeholder='items_received_name name' onChange={handleCustodianChange} className="border-2 border-black" /></td>
                  </tr>
                  <tr>
                    <td><label className='font-bold' htmlFor="items_received_date">Date :</label></td>
                    <td>
                      {/* <!-- <span>MEMS</span> --> */}
                      <input type="text" id="items_received_date" name="items_received_date" value={formData.items_received_date} placeholder='items_received_date name' onChange={handleChange} className="border-2 border-black" /></td>
                  </tr>
                
                </tbody>
              </table>

            </div>
            <div className='flex-col w-1/2 px-12 py-12'>
              <div className='flex flex-row justify-center text-xl font-semibold'>
                <h2>Items Issued</h2>
              </div>
              <table>
                <tbody>
                  <tr>
                    <td><label className='font-bold' htmlFor="items_issued_name">Name  :</label></td>
                    <td>
                      {/* <!-- <span>Dr. Nisheeth K. Prasad</span> --> */}
                      <input type="text" id="items_issued_name" name="items_issued_name" value={formData.items_issued_name} placeholder='items_issued_name name' onChange={handleCustodianChange} className="border-2 border-black" /></td>
                  </tr>
                  <tr>
                    <td><label className='font-bold' htmlFor="items_issued_date">Date :</label></td>
                    <td>
                      {/* <!-- <span>MEMS</span> --> */}
                      <input type="text" id="items_issued_date" name="items_issued_date" value={formData.items_issued_date} placeholder='items_issued_date name' onChange={handleChange} className="border-2 border-black" /></td>
                  </tr>
                
                 
                </tbody>
              </table>

            </div>
            <div className='flex-col w-1/2 px-12 py-12'>
              <div className='flex flex-row justify-center text-xl font-semibold'>
                <h2>Actioned in Ledger</h2>
              </div>
              <table>
                <tbody>
                  <tr>
                    <td><label className='font-bold' htmlFor="action_ledger_name">Name:</label></td>
                    <td>
                      {/* <!-- <span>Dr. Nisheeth K. Prasad</span> --> */}
                      <input type="text" id="action_ledger_name" name="action_ledger_name" value={formData.action_ledger_name} placeholder='action_ledger_name name' onChange={handleCustodianChange} className="border-2 border-black" /></td>
                  </tr>
                  <tr>
                    <td><label className='font-bold' htmlFor="action_ledger_date">Date :</label></td>
                    <td>
                      {/* <!-- <span>MEMS</span> --> */}
                      <input type="text" id="action_ledger_date" name="action_ledger_date" value={formData.action_ledger_date} placeholder='action_ledger_date name' onChange={handleChange} className="border-2 border-black" /></td>
                  </tr>
                </tbody>
              </table>

            </div>
          </div>
          <div className='p-4'> 
            <input type="text" onChange={(e)=>setSearch(e.target.value)} className="border-2 border-black"/>
            {search.toLowerCase() !== '' && (
            <table>
              <thead>
                <tr>
                  {/* <th>Sno</th> */}
                  <th>Name of Supplier </th>
                  <th>Designation</th>
                 
                </tr>
              </thead>
              <tbody>
                {data.filter((item)=>
                {
                  return search.toLowerCase()===''? "" :(item.name.toLowerCase().includes(search)) 
                  // || (item.designation.toLowerCase().includes(search))
                }
                ).map((item,ind) => (
                  <tr key={ind} onClick={() => handleUserSelect(item.id,item.name)}>
                    {/* <td>{row.sno}</td> */}
                    <td>{item.name}</td>
                    <td>{item.designation}</td>
                    
                  </tr>
                ))}
              </tbody>
            </table>)}
            </div>
          <div className='flex justify-center w-full mb-8'>
            <button onClick={(e) => handleSubmit(e)} >Submit</button>
          </div>
        </form>
      </div>




    </div>
  )
}

export default SS04form;
