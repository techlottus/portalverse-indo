import React, { useState } from 'react'
import Input from "@/components/lottus-education/Input"
import * as Field from "@/components/lottus-education/Field"
import * as Select from "@/components/lottus-education/Select"
import cn from "classnames"


type LeadWhatsappFormTypes = {
  leadPhone?: string | string[];
  utmData?: {
    utm_content?: string | string[] | null;
    utm_term?: string | string[] | null;
    gclid?: string | string[] | null;
    source?: string | string[] | null;
    utm_campaign?: string | string[] | null;
    utm_medium?: string | string[] | null;
  }
  utmLeads?: string;
};
/**
 * LeadWhatsappForm Component
 *
 * This component renders a form for collecting lead information and initiating a WhatsApp chat.
 * It includes fields for name, last name, phone number, email, and modality selection.
 * The form validates user input and sends the data to a specified endpoint upon submission.
 *
 * @param {LeadWhatsappFormTypes} props - The properties passed to the component.
 * @property {string} props.leadPhone - The phone number of the lead.
 * @property {object} props.utmData - The UTM data associated with the lead, typically used for tracking marketing campaigns.
 *
 * @returns {JSX.Element} The rendered LeadWhatsappForm component.
 *
 * @remarks
 * - The form dynamically adjusts modality options based on the business unit (`NEXT_PUBLIC_BUSINESS_UNIT`).
 * - Validation is performed for all fields, including name, last name, phone, email, and modality.
 * - On successful submission, the form sends the data to the specified endpoint (`NEXT_PUBLIC_PAYMENT_WEBHOOK`) and redirects the user to WhatsApp.
 *
 * @example
 * <LeadWhatsappForm leadPhone="+521234567890" utmData={{ utm_campaign: "campaign", utm_source: "source" }} />
 */
export const LeadWhatsappForm = (props: LeadWhatsappFormTypes) => {
  /**
   * Destructures the `leadPhone` and `utmData` properties from the `props` object.
   * @property {string} leadPhone - The phone number of the lead.
   * @property {object} utmData - The UTM data associated with the lead, typically used for tracking marketing campaigns.
   */
  const { leadPhone, utmData, utmLeads } = props;

  /**
   * Retrieves the business unit from the environment variables.
   * @constant
   * @type {string}
   */
  const bu = process.env.NEXT_PUBLIC_BUSINESS_UNIT
  const endpoint = process.env.NEXT_PUBLIC_PAYMENT_WEBHOOK || "";

  /**
   * An object representing the error state of various form controls.
   * Each property corresponds to a specific form field and indicates
   * whether there is an error associated with that field.
   */
  const errorControls = {
    name: false,
    last_name: false,
    phone: false,
    // email: false,
    // modality: false,
  }
  /**
   * An object containing error messages for form validation.
   * Each key corresponds to a specific form field, and the value is the error message
   * displayed when the field validation fails.
   */
  const errorMessages = {
    name: "Ingresa tu nombre",
    last_name: "Ingresa tu apellido",
    // email: "Ingresa un correo electrónico válido",
    phone: "Ingresa un numero de teléfono válido",
    // modality: "Campo requerido",
  }
  /**
   * Represents the initial validation state for form data fields.
   * Each property corresponds to a specific field in the form and indicates
   * whether the field's data is valid or not.
   */
  const dataValidInit = {
    name: false,
    last_name: false,
    phone: false,
    // email: false,
    // modality: false,
  }
  /**
   * Initial data structure for lead information in the WhatsApp form.
   */
  const leadDataInit = {
    name: "",
    last_name: "",
    phone: "",
    // email: "",
    modality: "Presencial",
  }



  //State hook to manage the lead data for the form.
  const [leadData, setLeadData] = useState(leadDataInit)
  // State hook to manage validation errors for lead data.
  const [leadDataErrors, setLeadDataError] = useState(errorControls)

  const [loading, setLoading] = useState(false)

  // State hook to manage the validity of the data in the form.
  const [dataValid, setdataValid] = useState(dataValidInit)
  // State hook to manage the phone value
  const [phone, setPhone] = useState("")

  /**
   * Handles changes to the phone input field by sanitizing and formatting the input value.
   * 
   * - Removes any characters that are not digits or the '+' symbol.
   * - If the value starts with a '+' symbol, it removes the next three characters (e.g., country code).
   * - Ensures the resulting value contains only digits and limits its length to 10 characters.
   * - Updates the phone state with the sanitized value.
   * 
   * @param e - The event object from the input field change event.
   */
  const handleInputPhoneChange = (e: any) => {
    let value = e.target.value.replace(/[^0-9+]/g, '');
    if (value.startsWith('+')) {
      value = value.slice(3);
    }
    value = value.replace(/\D/g, '').slice(0, 10);
    setPhone(value);
  };

  /**
   * Validates the input data based on the specified control type.
   *
   * @param control - The type of control to validate. Possible values:
   *   - "name": Validates that the value contains only letters (including accented characters) and spaces.
   *   - "last_name": Validates that the value contains only letters (including accented characters) and spaces.
   *   - "phone": Validates that the value is a 10-digit number and that the `country_code` is not empty.
   *   - "modality": Validates that the value is not empty and is not equal to "Seleccione una modalidad".
   *   - "countryCode": Validates that the value matches the format of a country code (e.g., "+1", "+52").
   *   - "email": Validates that the value is a properly formatted email address.
   *   - Any other value: Defaults to valid.
   *
   * @param value - The input value to validate.
   * @returns A boolean indicating whether the input value is valid for the specified control type.
   */
  const validateData = (control: string, value: string) => {
    let isValid = true;
    switch (control) {
      case "name":
        isValid = /^[a-zA-ZÀ-ÿ\s]+$/.test(value)
        break
      case "last_name":
        isValid = /^[a-zA-ZÀ-ÿ\s]+$/.test(value)
        break
      case "phone":
        isValid = /^\d{10}$/.test(value)
        break
      // case "email":
      //   isValid = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z0-9]{2,4}$/i.test(value)
      //   break
      // case "modality":
      //   isValid = value !== "" && value !== "Seleccione una modalidad"
      //   break
      // case "countryCode":
      //   isValid = /^\+[0-9]{1,2}$/.test(value);
      //   break
      default:
        isValid = true
    }
    return isValid
  }

  /**
   * Handles the input data for a form by updating the lead data, lead data error, 
   * and data validity states based on the provided value and control.
   *
   * @param value - The input value to be set for the specified control.
   * @param control - The name of the control (field) being updated.
   *
   * Updates:
   * - `leadData`: Sets the value for the specified control.
   * - `leadDataError`: Sets an error flag for the control based on validation.
   * - `dataValid`: Sets the validity status for the control based on validation.
   */
  const handleInputData = (value: string, control: string) => {
    setLeadData((prevState) => ({
      ...prevState,
      [control]: value,
    }))
    setLeadDataError((prevState) => ({
      ...prevState,
      [control]: validateData(control, value) ? false : true,
    }))
    setdataValid((prevState) => ({
      ...prevState,
      [control]: validateData(control, value),
    }))
  }

  /**
   * Handles the form submission process for the Lead WhatsApp Form.
   * Validates the required data fields and sends a POST request to create a lead.
   * If the request is successful, redirects the user to WhatsApp with a pre-filled message.
   *
   * @param e - The event object from the form submission.
   * 
   * @throws Will throw an error if the POST request fails.
   * 
   * @remarks
   * - The function checks for the presence of required fields: `countryCode`, `email`, `last_name`, `modality`, `name`, and `phone`.
   * - Sends the lead data to the endpoint `/leads/create` with additional metadata.
   * - Constructs the WhatsApp URL using the lead's phone number and name.
   * - Logs errors to the console if the request fails.
   * 
   * @example
   * // Example usage in a form:
   * <form onSubmit={handleSubmit}>
   *   <input type="text" name="name" />
   *   <button type="submit">Submit</button>
   * </form>
   */
  const handleSubmit = async (e: any, mediaq: string = "desktop") => {
    e.preventDefault()
    setLoading(true)
    if (dataValid?.name && dataValid?.phone) {
      // Enviar datos
      console.log("Datos enviados:", leadData, utmData);

      try {
        const response = await fetch(`${endpoint}/leads/create`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: leadData.name,
            last_name: leadData.last_name,
            email: null,
            phone: leadData.phone,
            modality: 'Presencial',
            metadata: {
              "bussiness_line": bu === 'UTEG' && (leadData?.modality === 'online' || leadData?.modality === 'semipresencial') ? "ULA" : bu,//todo agregar condiciones según modalidad
              "lead_source": "Digital",
              "campusWTL": "TLALNEPANTLA",
              "utm_chanel": "Whatsapp",
              "utm_medium": utmData?.utm_medium || null,
              "utm_campaign": utmData?.utm_campaign || null,
              "utm_content": utmData?.utm_content || null,
              "utm_term": utmData?.utm_term || null,
              "gclid": utmData?.gclid || null,
              "source": utmData?.source || null,
              "utm_leads": utmLeads
            },
          }),
        });
        if (!response.ok) {
          console.log(response)
          throw new Error(`Error: ${response} ${response}`);
        }
        setLoading(false)
        // Whatsapp redirect 
        window.parent.postMessage({
          event: "whatsapp_lead",
          ...leadData, ...utmData,
        }, "*");
        if (leadPhone && mediaq === "desktop" && window.top) {
          window.top.location.href = `https://web.whatsapp.com/send?phone=${leadPhone}&text=Hola, soy ${leadData.name}. Estoy interesado en más información.`
        }
        else if ((leadPhone && mediaq === "desktop" && !window.top)) {
          window.location.href = `https://web.whatsapp.com/send?phone=${leadPhone}&text=Hola, soy ${leadData.name}. Estoy interesado en más información.`
        }
        if ((leadPhone && mediaq === "mobile" && window.top)) {
          window.top.location.href = `https://wa.me/${leadPhone}`;
        }
        else if (leadPhone && mediaq === "mobile" && !window.top) {
          window.location.href = `https://wa.me/${leadPhone}`;
        }
      } catch (error) {
        setLoading(false)
        console.error("Error en el envío:", error);
      }
    }
  }
  return (
    <form className='flex flex-col gap-3'>
      <Field.Root hasError={leadDataErrors.name}>
        <Input
          isValid={dataValid?.name}
          placeholder="Nombre"
          disabled={false}
          name="name"
          id="name"
          value={leadData?.name}
          required
          hasError={leadDataErrors.name}
          onFocus={(e: any) => handleInputData(e.target.value, "name")}
          onKeyUp={(e: any) => handleInputData(e.target.value, "name")}
          onChange={(e: any) => {
            handleInputData(e.target.value, "name")
          }}
          onBlur={(e: any) => handleInputData(e.target.value, "name")}
        />
        {leadDataErrors?.name && <Field.Helper className='text-error-500'>{errorMessages?.name}</Field.Helper>}
      </Field.Root>
      <Field.Root hasError={errorControls.last_name}>
        <Input
          isValid={dataValid?.last_name}
          placeholder="Apellido(s)"
          disabled={false}
          name="last_name"
          id="last_name"
          value={leadData?.last_name}
          required
          hasError={errorControls.last_name}
          onFocus={(e: any) => handleInputData(e.target.value, "last_name")}
          onKeyUp={(e: any) => handleInputData(e.target.value, "last_name")}
          onChange={(e: any) => {
            handleInputData(e.target.value, "last_name")
          }}
          onBlur={(e: any) => handleInputData(e.target.value, "last_name")}
        />
        {leadDataErrors?.last_name && <Field.Helper className='text-error-500'>{errorMessages?.last_name}</Field.Helper>}
      </Field.Root>
      <Field.Root hasError={leadDataErrors.phone} >
        <Input
          className='w-full'
          isValid={dataValid.phone}
          placeholder="Número de Whatsapp"
          value={phone}
          name="phone"
          id="phone"
          required
          maxLength={10}
          hasError={leadDataErrors.phone}
          onFocus={() => handleInputData(phone, "phone")}
          onKeyUp={() => handleInputData(phone, "phone")}
          onChange={(e: any) => {
            handleInputPhoneChange(e)
            handleInputData(phone, "phone")
          }}
          onBlur={(e: any) => handleInputData(phone, "phone")}
        />
        {leadDataErrors?.phone && <Field.Helper className='text-error-500'>{errorMessages?.phone}</Field.Helper>}
      </Field.Root>
      {/* <Field.Root hasError={errorControls.email}>
        <Input
          isValid={dataValid.email}
          placeholder="Correo Electrónico"
          name="mail"
          id="mail"
          value={leadData?.email}
          required
          hasError={leadDataErrors.email}
          onFocus={(e: any) => handleInputData("email", e.target.value)}
          onKeyUp={(e: any) => handleInputData(e.target.value, "email")}
          onChange={(e: any) => {
            handleInputData(e.target.value, "email")
          }}
          onBlur={(e: any) => {
            handleInputData(e.target.value, "email")
          }} />
        {leadDataErrors.email && <Field.Helper className='text-error-500'>{errorMessages.email}</Field.Helper>}
      </Field.Root> */}
      {/* <Field.Root hasError={leadDataErrors.modality}>
        <Select.Root
          required
          disabled={false}
          onValueChange={(value: string) => handleInputData(value, "modality")}
          value={leadData?.modality}
        >
          <Select.Trigger
            className='flex w-full'
            value={leadData?.modality}
            hasError={leadDataErrors.modality}
            isValid={validateData("modality", leadData?.modality)}>
            <Select.Value placeholder="Modalidad " className='w-full flex' />
          </Select.Trigger>
          <Select.Content className='!z-[999999999]'>
            {optionsSelect?.map((opt: any, i: number) => (
              <Select.Item
                onClick={() => handleInputData(opt?.value, "modality")}
                key={i}
                value={opt?.value} >
                {opt?.text}
              </Select.Item>
            ))
            }
          </Select.Content>
        </Select.Root>
        {leadDataErrors.modality && <Field.Helper>{errorMessages?.modality}</Field.Helper>}
      </Field.Root> */}
      <button disabled={!dataValid?.name  || !dataValid?.last_name || !dataValid?.phone  || loading} type="submit"
        onClick={(e: any) => handleSubmit(e, "mobile")} className={cn('desktop:hidden tablet:hidden px-4 py-3 rounded-2xl bg-[#25d366] text-surface-0 font-texts font-normal text-lg cursor-pointer', {
          ["opacity-50 cursor-not-allowed"]: !dataValid?.name  || !dataValid?.last_name || !dataValid?.phone ,
        })}>{loading ? <span className="material-symbols-outlined text-surface-100 !text-[20px] align-middle animate-spin">progress_activity</span> : "Iniciar Chat"}</button>
      <button disabled={loading || !dataValid?.name || !dataValid?.last_name || !dataValid?.phone } type="submit"
        onClick={(e: any) => handleSubmit(e)} className={cn('mobile:hidden px-4 py-3 rounded-2xl bg-[#25d366] text-surface-0 font-texts font-normal text-lg cursor-pointer', {
          ["opacity-50 cursor-not-allowed"]: !dataValid?.name || !dataValid?.last_name || !dataValid?.phone ,
        })}>{loading ? <span className="material-symbols-outlined text-surface-100 !text-[20px] align-middle animate-spin">progress_activity</span> : "Iniciar Chat"}</button>
    </form>
  )
}
