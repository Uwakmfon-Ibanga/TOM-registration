import React, { useState } from 'react'

const CamperRegestration = () => {
  const [campersFirstName, setCampersFirstName] = useState('')
  const [campersMiddleName, setCampersMiddleName] = useState('')
  const [campersLastName, setCampersLastName] = useState('')
  const [age, setAge] = useState('')
  const[gender, setGender] = useState('')
  const[parentsFirstName, setParentsFirstName] = useState('')
  const[parentsLastName, setParentsLastName] = useState('')
  const[phone1, setPhone1] = useState('')
  const[phone2, setPhone2] = useState('')
  const[address, setAddress] = useState('')
  const[relationship, setRelationship] = useState('')
  return (
    <>
    <form className='m-auto w-[100%] bg-gray-200 flex flex-col gap-10'>
    <div style={{backgroundImage: "url('/stock1.jpg')"}} className=' w-full h-[200px] m-auto bg-center bg-cover bg-no-repeat'>
        </div>
        
    <h1 className='text-center text-[2em] text-[green] font-bold'>TOM Camp Registration</h1>


<div className='flex flex-col gap-12'>
    {/* container for camper's info */}
    <section className='mx-3 flex flex-col gap-4'>
      <h1 className='text-[1.3em] text-2xl text-green-800 font-medium'>Camper's Information</h1>

      {/* container for names */}
      <div className='flex gap-2'>
        <label htmlFor="firstName" className='text-[1em] text-green-800 font-medium'>First Name
        <input type="text" id='firstName' value={campersFirstName} onChange={(e) => setCampersFirstName(e.target.value)} 
        className='border-2 border-gray-300 rounded-md p-2 w-full' />
        </label>

        <label htmlFor="middleName" className='text-[1em] text-green-800 font-medium'>Middle Name
        <input type="text" id='firstName' value={campersMiddleName} onChange={(e) => setCampersMiddleName(e.target.value)} 
        className='border-2 border-gray-300 rounded-md p-2 w-full' />
        </label>

         <label htmlFor="middleName" className='text-[1em] text-green-800 font-medium'>Middle Name
        <input type="text" id='firstName' value={campersLastName} onChange={(e) => setCampersLastName(e.target.value)} 
        className='border-2 border-gray-300 rounded-md p-2 w-full' />
        </label>
      </div>

      {/* container for age */}
        <label htmlFor="age" className='text-[1em] text-green-800 font-medium'>Age
        <input type="number" id='age' value={age} onChange={(e) => setAge(e.target.value)} 
        className='border-2 border-gray-300 rounded-md p-2 w-full' />
        </label>

        {/* container for gender */}
       <div id='gender'>
        <h2 className='text-[1em] text-green-800 font-medium'>Gender</h2>
        
         <label htmlFor="male" className='text-[1.2em] font-light flex items-center'>
        <input type="radio"
        name='gender'
        id='male'
        value={'male'}
        checked={gender === 'male'}
        onChange={(e) => setGender(e.target.value)} />
        male</label>

         <label htmlFor="female" className='text-[1.2em] font-light flex items-center'>
        <input type="radio"
        name='gender'
        id='female'
        value={'female'}
        checked={gender === 'female'}
        onChange={(e) => setGender(e.target.value)} />
        female</label>

       </div>



    </section>

    {/* container for guardian's info */}
    <section className='mx-3 flex flex-col gap-4'>
      <h1 className='text-[1.3em] text-2xl text-green-800 font-medium'>Guardian's Information</h1>

      {/* container for names */}
      <div className='flex gap-2'>
        <label htmlFor="firstName" className='text-[1em] text-green-800 font-medium'>First Name
        <input type="text" id='firstName' value={campersFirstName} onChange={(e) => setFirstName(e.target.value)} 
        className='border-2 border-gray-300 rounded-md p-2 w-full' />
        </label>


         <label htmlFor="middleName" className='text-[1em] text-green-800 font-medium'>Last Name
        <input type="text" id='firstName' value={campersLastName} onChange={(e) => setLastName(e.target.value)} 
        className='border-2 border-gray-300 rounded-md p-2 w-full' />
        </label>
      </div>

      {/* container for phone number */}
        <label htmlFor="phone-number" className='text-[1em] text-green-800 font-medium'>phone number
        <input type="number" id='phone-number' value={phone1} onChange={(e) => setPhone1(e.target.value)} 
        className='border-2 border-gray-300 rounded-md p-2 w-full' />
        </label>

        <label htmlFor="phone-number2" className='text-[1em] text-green-800 font-medium'>phone number 2 
        <input type="number" id='phone-number2' value={phone2} onChange={(e) => setPhone2(e.target.value)} 
        className='border-2 border-gray-300 rounded-md p-2 w-full' />
        <p className='font-medium text-xs'>(should be a different person's phone number)</p>
        </label>


    </section>



    {/* container for Emergency info */}
    <section className='mx-3 flex flex-col gap-4'>
      <h1 className='text-[1.3em] text-2xl text-green-800 font-medium'>Emergency Information</h1>

      <label >
        Does the Camper have any allergies, chronic illness, or medical conditions? If yes, please describe.
        <textarea name="" id="" className='hover:border-green-800 border-2 border-gray-300 rounded-md p-2 w-full' cols="30" rows="5">
        </textarea>
      </label>

      <label>
        Is the camper prescribed an inhaler? If yes, please explain any instructions.
        <textarea name="" id="" className='hover:border-green-800 border-2 border-gray-300 rounded-md p-2 w-full' cols="30" rows="5">
        </textarea>
      </label>


    </section>
    </div>

    <button className='self-center bg-green-800 text-white p-2 rounded' type="submit">Submit</button>
    </form>
    </>
  )
}

export default CamperRegestration
