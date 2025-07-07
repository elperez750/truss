import { createClient } from "@/lib/supabase/server";
import { ContractorSubmitFormData } from "@/components/forms/contractor/ContractorDetailsSubmitForm";


export async function submitContractorDetails(formData: ContractorSubmitFormData) {
    console.log("formData", formData);
    return {
        success: true,
        message: "Profile submitted successfully"
    }



}