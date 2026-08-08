import { toast } from "../../src/components/Toast/toast";
import call from '../../src/utils/call';
export const getBadgeColor = (status) => {
    const colorMap = {
        "Pending": "orange",
        "Success": "green",
        "Partial Success": "orange",
        "Error": "red",
        "Timed Out": "orange"
    };
    return colorMap[status] || "gray";
};
export const fieldsToIgnore = [
    "Section Break",
    "Column Break",
    "Tab Break",
    "HTML",
    "Table",
    "Table MultiSelect",
    "Button",
    "Image",
    "Fold",
    "Heading"
];
export const getChildTableName = (doctype, parentDocType, docs) => {
    let childTableName = '';
    let doctypeFields = docs.filter((doc) => {
        return doc.name == parentDocType;
    })[0].fields;
    doctypeFields.forEach((field) => {
        if (field.options == doctype) {
            childTableName = field.fieldname;
        }
    });
    return childTableName;
};
export const getPreviewData = (importName, file, sheet) => {
    return call("frappe.core.doctype.data_import.data_import.get_preview_from_template", {
        data_import: importName,
        import_file: file,
        google_sheets_url: sheet
    }).catch((error) => {
        toast.error(error.messages?.[0] || error);
        console.error("Error fetching preview data:", error);
    });
};
