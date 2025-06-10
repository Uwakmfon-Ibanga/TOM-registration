import React, { useState, useRef } from "react";
import supabase from "../config/supabaseClient";
import SignatureCanvas from "react-signature-canvas";

const CamperRegestration = () => {
  const [campersFirstName, setCampersFirstName] = useState("");
  const [campersMiddleName, setCampersMiddleName] = useState("");
  const [campersLastName, setCampersLastName] = useState("");
  const [age, setAge] = useState("");
  const [school, setSchool] = useState("");
  const [gender, setGender] = useState("");
  const [parentsFirstName, setParentsFirstName] = useState("");
  const [parentsLastName, setParentsLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone1, setPhone1] = useState("");
  const [phone2, setPhone2] = useState("");
  const [HomeAddress, setHomeAddress] = useState("");
  const [churchAddress, setChurchAddress] = useState("");
  const [relationship, setRelationship] = useState("");
  const [previouCampAttendings, setPreviouCampAttendings] = useState("");
  const [attendedCampBefore, setAttendedCampBefore] = useState(false);
  const [medicalInfo, setMedicalInfo] = useState("");
  const [inhalerInfo, setInhalerInfo] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [camperSignature, setCamperSignature] = useState("");
  const [guardianSignature, setGuardianSignature] = useState("");

  const colors = ["blue", "red", "yellow", "brown"];

  // useRefs for the two signatures
  const camperSigRef = useRef(null);
  const guardianSigRef = useRef(null);

  // clear camper signature
  const clearCamperSignature = () => {
    camperSigRef.current.clear();
    setCamperSignature(""); // clear state too
  };

  // Save camper signature
  const saveCamperSignature = () => {
    if (camperSigRef.current.isEmpty()) {
      alert("Please provide the camper signature before saving.");
      return;
    }
    const dataURL = camperSigRef.current.toDataURL("image/png");
    setCamperSignature(dataURL);
    console.log("Camper signature:", dataURL);
  };

  // Clear guardian signature
  const clearGuardianSignature = () => {
    guardianSigRef.current.clear();
    setGuardianSignature(""); // clear state too
  };

  // Save guardian signature
  const saveGuardianSignature = () => {
    if (guardianSigRef.current.isEmpty()) {
      alert("Please provide the guardian signature before saving.");
      return;
    }
    const dataURL = guardianSigRef.current.toDataURL("image/png");
    setGuardianSignature(dataURL);
    console.log("Guardian signature:", dataURL);
  };

  const uploadPassport = async (file) => {
    if (!file) {
      alert("No file selected for upload");
      return null;
    }

    // Create a unique filename, e.g., using timestamp + original name
    const fileName = `${Date.now()}_${file.name}`;

    // Upload file to the 'passports' bucket
    const { data, error } = await supabase.storage
      .from("passports")
      .upload(fileName, file);

    if (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload passport image.");
      return null;
    }

    // Return the public URL or path to the uploaded file
    // If bucket is public:
    const publicURL = supabase.storage.from("passports").getPublicUrl(fileName)
      .data.publicUrl;

    return publicURL;
  };

  const assignGroup = async () => {
    // Get the current number of campers per group from Supabase
    const { data: campers, error } = await supabase
      .from("campersDetails")
      .select("group")
      .order("id", { ascending: true });

    if (error) {
      console.error("Error fetching campers data:", error);
    }

    // console.log("Current campers data:", campers);

    // Count campers in each group
    const groupCount = {
      blue: 0,
      red: 0,
      yellow: 0,
      brown: 0,
    };

    // check if the list of signups is empty(the first person is signing up) then it skips the counting to avoid possible errors
    if (campers && campers.length > 0) {
      campers.forEach((camper) => {
        if (groupCount[camper.group] !== undefined) {
          groupCount[camper.group]++;
        }
      });
    }

    // Find the group with the least number of campers
    const group = colors.reduce((prev, curr) =>
      groupCount[prev] <= groupCount[curr] ? prev : curr
    );

    return group; // Return the group with the least campers
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const group = await assignGroup();
    saveCamperSignature();
    saveGuardianSignature();

    if (!camperSignature || !guardianSignature) {
      alert("Please save both signatures before submitting.");
      return;
    }

    // incase the camper has not uploaded a picture of them
    //   if (!imageFile) {
    //   alert("Please upload the passport image.");
    //   return;
    // }

    // Upload passport
    // const passportUrl = await uploadPassport(imageFile);

    //   if (!passportUrl) {
    //     setError('Passport upload failed. Please retry.');
    //   alert('Failed to upload passport image. Please try again.');
    //   console.error('Upload failed: passportUrl is empty.');
    //   return;
    // }

    const { data, error } = await supabase
      .from("campersDetails")
      .insert([
        {
          campersFirstName,
          campersMiddleName,
          campersLastName,
          group,
          age,
          school,
          gender,
          parentsFirstName,
          parentsLastName,
          email,
          phone1,
          phone2,
          HomeAddress,
          churchAddress,
          relationship,
          previouCampAttendings,
          attendedCampBefore,
          medicalInfo,
          inhalerInfo,
          campersSignature: camperSignature,
          parentsSignature: guardianSignature,
        },
      ])
      .select('id')

      const ID = data[0].id  

    if (error) {
      console.error("Error inserting camper details:", error);
      alert(
        "There was an error submitting the form. Please try again.",
        error.message
      );
    } else {
      console.log("Camper details inserted successfully:", data);
      alert("Camper details submitted successfully!");
    }

    // Send email notification
    try {

      const response = await fetch(
        "https://zuhhfglfyvwrlegthnmf.functions.supabase.co/sendEmail",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer mycustomkey123`,
          },
          body: JSON.stringify({
            email,
            name: `${campersFirstName} ${campersLastName}`,
            group,
            ID,
          }),
        }
      );

      const result = await response.json();
      console.log("Email sent successfully:", result);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="lg:px-[10rem] w-[100%] bg-gray-200 flex flex-col gap-10 pb-6"
      >
        <div
          style={{ backgroundImage: "url('/stock1.jpg')" }}
          className=" w-full h-[200px] m-auto bg-center bg-cover bg-no-repeat"
        ></div>

        <h1 className="text-center text-[2em] text-[green] font-bold">
          TOM Camp Registration
        </h1>

        <div className="flex flex-col gap-12">
          {/* container for camper's info */}
          <section className="mx-3 flex flex-col gap-4">
            <h1 className="text-[1.3em] text-2xl text-green-800 font-medium">
              Camper's Information
            </h1>

            {/* container for names */}
            <div className="flex gap-2">
              <label
                htmlFor="firstName"
                className="text-[1em] text-green-800 font-medium"
              >
                First Name
                <input
                  required
                  type="text"
                  id="firstName"
                  placeholder="Jerry"
                  value={campersFirstName}
                  onChange={(e) => setCampersFirstName(e.target.value)}
                  className="border-2 border-gray-300 rounded-md p-2 w-full"
                />
              </label>

              <label
                htmlFor="middleName"
                className="text-[1em] text-green-800 font-medium"
              >
                Middle Name
                <input
                  required
                  type="text"
                  id="firstName"
                  placeholder="Peter"
                  value={campersMiddleName}
                  onChange={(e) => setCampersMiddleName(e.target.value)}
                  className="border-2 border-gray-300 rounded-md p-2 w-full"
                />
              </label>

              <label
                htmlFor="middleName"
                className="text-[1em] text-green-800 font-medium"
              >
                Last Name
                <input
                  required
                  type="text"
                  id="firstName"
                  placeholder="Tom"
                  value={campersLastName}
                  onChange={(e) => setCampersLastName(e.target.value)}
                  className="border-2 border-gray-300 rounded-md p-2 w-full"
                />
              </label>
            </div>

            container for age
            <label
              htmlFor="age"
              className="text-[1em] text-green-800 font-medium"
            >
              Age
              <input
                required
                type="number"
                id="age"
                placeholder="16"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="border-2 border-gray-300 rounded-md p-2 w-full"
              />
            </label>

            {/* container for school */}
            <label
              htmlFor="school"
              className="text-[1em] text-green-800 font-medium"
            >
              Name Of School
              <input
                required
                type="text"
                id="school"
                placeholder="Community Comprehensive College"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                className="border-2 border-gray-300 rounded-md p-2 w-full"
              />
            </label>

            {/* container for Home Address */}
            <label
              htmlFor="homeAddress"
              className="text-[1em] text-green-800 font-medium"
            >
              Home Address
              <input
                required
                type="text"
                placeholder="no. 2 heaven street, off streets of gold, uyo"
                id="HomeAddress"
                value={HomeAddress}
                onChange={(e) => setHomeAddress(e.target.value)}
                className="border-2 border-gray-300 rounded-md p-2 w-full"
              />
            </label>

            {/* container for church Address */}
            <label
              htmlFor="address"
              className="text-[1em] text-green-800 font-medium"
            >
              Name and address of church
              <textarea
                required
                name=""
                id=""
                placeholder="UfokAbasi. no. 2 heaven street, off streets of gold, uyo"
                className="hover:border-green-800 border-2 border-gray-300 rounded-md p-2 w-full"
                cols="20"
                rows="3"
                value={churchAddress}
                onChange={(e) => setChurchAddress(e.target.value)}
              ></textarea>
            </label>

            {/* input for user passport */}
            <label
              htmlFor="camperImage"
              className="text-[1em] text-green-800 font-medium"
            >
              Upload a passport
            </label>
            <input
              required
              id="camperImage"
              onChange={handleImageChange}
              type="file"
              accept="image/"
              className="border-2"
            />

            {/* container for 'if attended camp before' */}
            <div className="flex gap-4">
              <div id="gender">
                <h2 className="text-[1em] text-green-800 font-medium">
                  Have You Attended Camp Before?
                </h2>

                <label className="text-[1.2em] font-light flex items-center">
                  <input
                    required
                    type="radio"
                    name="hasAttendedCampBefore"
                    value={true}
                    // checked={}
                    onChange={() => {
                      setAttendedCampBefore(true);
                      console.log("this camper has attended camp before");
                      console.log(attendedCampBefore);
                    }}
                  />
                  yes
                </label>

                <label className="text-[1.2em] font-light flex items-center">
                  <input
                    type="radio"
                    name="hasAttendedCampBefore"
                    value={false}
                    // checked={}
                    onChange={() => {
                      setAttendedCampBefore(false);
                      console.log("this camper has not attended camp before");
                      console.log(attendedCampBefore);
                    }}
                  />
                  No
                </label>
              </div>

              {attendedCampBefore && (
                <label
                  htmlFor="homeAddress"
                  className="text-[1em] text-green-800 font-medium"
                >
                  When?
                  <input
                    type="text"
                    id="HomeAddress"
                    value={previouCampAttendings}
                    placeholder="2022, 2023"
                    onChange={(e) => setPreviouCampAttendings(e.target.value)}
                    className="border-2 border-gray-300 rounded-md p-2 w-full"
                  />
                </label>
              )}
            </div>

            {/* container for gender */}
            <div id="gender">
              <h2 className="text-[1em] text-green-800 font-medium">Gender</h2>

              <label
                htmlFor="male"
                className="text-[1.2em] font-light flex items-center"
              >
                <input
                  required
                  type="radio"
                  name="gender"
                  id="male"
                  value={"male"}
                  checked={gender === "male"}
                  onChange={(e) => setGender(e.target.value)}
                />
                male
              </label>

              <label
                htmlFor="female"
                className="text-[1.2em] font-light flex items-center"
              >
                <input
                  required
                  type="radio"
                  name="gender"
                  id="female"
                  value={"female"}
                  checked={gender === "female"}
                  onChange={(e) => setGender(e.target.value)}
                />
                female
              </label>
            </div>

            <div className="w-[200px] flex flex-col gap-2">
              <label className="text-[1em] text-green-800 font-medium">
                Camper's signature
                <SignatureCanvas
                  ref={camperSigRef}
                  penColor="green"
                  canvasProps={{
                    width: 300,
                    height: 150,
                    className: "sigCanvas border border-black",
                  }}
                />
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="bg-green-800 text-white p-1 rounded border-1"
                  onClick={clearCamperSignature}
                >
                  clear
                </button>
                <button
                  type="button"
                  className="bg-green-800 text-white p-1 rounded border-1"
                  onClick={saveCamperSignature}
                >
                  save
                </button>
              </div>
            </div>
          </section>

          {/* container for guardian's info */}
          <section className="mx-3 flex flex-col gap-4">
            <h1 className="text-[1.3em] text-2xl text-green-800 font-medium">
              Guardian's Information
            </h1>

            {/* container for names */}
            <div className="flex gap-2">
              <label
                required
                htmlFor="firstName"
                className="text-[1em] text-green-800 font-medium"
              >
                First Name
                <input
                  type="text"
                  id="firstName"
                  value={parentsFirstName}
                  placeholder="John"
                  onChange={(e) => setParentsFirstName(e.target.value)}
                  className="border-2 border-gray-300 rounded-md p-2 w-full"
                />
              </label>

              <label
                htmlFor="middleName"
                className="text-[1em] text-green-800 font-medium"
              >
                Last Name
                <input
                  required
                  type="text"
                  id="firstName"
                  value={parentsLastName}
                  placeholder="Doe"
                  onChange={(e) => setParentsLastName(e.target.value)}
                  className="border-2 border-gray-300 rounded-md p-2 w-full"
                />
              </label>
            </div>

            {/* container for email */}
            <div>
              <label className="text-[1em] text-green-800 font-medium">
                Email
                <input
                  required
                  type="email"
                  placeholder="johndoe@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-2 border-gray-300 rounded-md p-2 w-full"
                />
              </label>
              <p className="font-medium text-xs">
                (this is the email that will receive necessary information)
              </p>
            </div>

            {/* container for relationship */}
            <label
              htmlFor="rlationship"
              className="text-[1em] text-green-800 font-medium"
            >
              Relationship
              <input
                required
                type="text"
                placeholder="Mother, Father, Uncle...."
                id="phone-number"
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                className="border-2 border-gray-300 rounded-md p-2 w-full"
              />
            </label>

            {/* container for phone number */}
            <label
              htmlFor="phone-number"
              className="text-[1em] text-green-800 font-medium"
            >
              phone number
              <input
                required
                type="number"
                id="phone-number"
                value={phone1}
                placeholder="09011111111"
                onChange={(e) => setPhone1(e.target.value)}
                className="border-2 border-gray-300 rounded-md p-2 w-full"
              />
            </label>

            <label
              htmlFor="phone-number2"
              className="text-[1em] text-green-800 font-medium"
            >
              phone number 2
              <input
                required
                type="number"
                id="phone-number2"
                value={phone2}
                placeholder="09022222222"
                onChange={(e) => setPhone2(e.target.value)}
                className="border-2 border-gray-300 rounded-md p-2 w-full"
              />
              <p className="font-medium text-xs">
                (should be a different person's phone number)
              </p>
            </label>

            <div className="w-[200px] flex flex-col gap-2">
              <label className="text-[1em] text-green-800 font-medium">
                guardian's signature
                <SignatureCanvas
                  ref={guardianSigRef}
                  required
                  penColor="green"
                  canvasProps={{
                    width: 300,
                    height: 150,
                    className: "sigCanvas border border-black",
                  }}
                />
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="bg-green-800 text-white p-1 rounded border-1"
                  onClick={clearGuardianSignature}
                >
                  clear
                </button>
                <button
                  type="button"
                  className="bg-green-800 text-white p-1 rounded border-1"
                  onClick={saveGuardianSignature}
                >
                  save
                </button>
              </div>
            </div>
          </section>

          {/* container for Emergency info */}
          <section className="mx-3 flex flex-col gap-4">
            <h1 className="text-[1.3em] text-2xl text-green-800 font-medium">
              Emergency Information
            </h1>

            <label>
              Does the Camper have any allergies, chronic illness, or medical
              conditions? If yes, please describe.
              <textarea
                name=""
                id=""
                className="hover:border-green-800 border-2 border-gray-300 rounded-md p-2 w-full"
                cols="30"
                rows="5"
                onChange={(e) => setMedicalInfo(e.target.value)}
                value={medicalInfo}
              ></textarea>
            </label>

            <label>
              Is the camper prescribed an inhaler? If yes, please explain any
              instructions.
              <textarea
                name=""
                id=""
                className="hover:border-green-800 border-2 border-gray-300 rounded-md p-2 w-full"
                cols="30"
                rows="5"
                onChange={(e) => setInhalerInfo(e.target.value)}
                value={inhalerInfo}
              ></textarea>
            </label>
          </section>

          <section className="flex flex-col gap-4 mx-3">
            <h1 className="text-[1.3em] text-2xl text-green-800 font-medium">
              Informed Consent and Acknowledgement
            </h1>
            <div className="flex flex-col gap-4 ">
              <p>
                I hereby give my approval for my child’s participation in any
                and all activities prepared by TOM during the selected camp. In
                exchange for the acceptance of said child’s candidacy by TOM, I
                assume all risk and hazards incidental to the conduct of the
                activities, and release, absolve and hold harmless TOM and all
                its respective officers, agents, and representatives from any
                and all liability for injuries to said child arising out of
                traveling to, participating in, or returning from selected camp
                sessions.
              </p>
              <p>
                In case of injury to said child, I hereby waive all claims
                against TOM including all coaches and affiliates, all
                participants, sponsoring agencies, advertisers, and, if
                applicable, owners and lessors of premises used to conduct the
                event. There is a risk of being injured that is inherent in all
                sports activities. Some of these injuries include, but are not
                limited to, the risk of fractures, paralysis, or death.
              </p>
            </div>
          </section>

          <section className="flex flex-col gap-4 mx-3">
            <h1 className="text-[1.3em] text-2xl text-green-800 font-medium">
              Confirmation
            </h1>

            <p>
              BY ACKNOWLEDGING AND SIGNING THE ABOVE FORM, I AM DELIVERING AN
              ELECTRONIC SIGNATURE THAT WILL HAVE THE SAME EFFECT AS AN ORIGINAL
              MANUAL PAPER SIGNATURE. THE ELECTRONIC SIGNATURE WILL BE EQUALLY
              AS BINDING AS AN ORIGINAL MANUAL PAPER SIGNATURE.
            </p>
          </section>
        </div>

        <button
          className="self-center bg-green-800 text-white p-2 rounded cursor-pointer hover:bg-green-600 active:bg-green-800"
          type="submit"
        >
          Register
        </button>
      </form>
    </>
  );
};

export default CamperRegestration;
