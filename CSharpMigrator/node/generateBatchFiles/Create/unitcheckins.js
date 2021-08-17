import { getSqlConnection } from '../../sqlConnection';

module.exports = {
    getRecordSet: async function(skip, take){
        let pool = await getSqlConnection();
    

        const { recordset } = await pool.request()
        .query(`select * from hl_unitcheckin_temp
                ORDER BY ID
                OFFSET     ${skip} ROWS 
                FETCH NEXT ${take} ROWS ONLY`);

        const batchKey = recordset.length > 0 ? `${recordset[0].ServiceID}_${recordset[recordset.length-1].ServiceID}` : null;


        return { recordset, batchKey  };
    },
    operationSchema: {
        entity: "hl_unit_checkins",
        operation: "POST",
        fields:{
            "hl_Location@odata.bind": {
                relatedEntity: "hl_housinglocations",
                field: "HousingLocationID"
            },
            "hl_name": "Name",
            "hl_checkindate": "CheckinDate",
            "hl_checkoutdate": "CheckoutDate",
            "hl_unitid@odata.bind": {
                relatedEntity: "hl_housingunits",
                field: "HousingUnitID"
            },
            "hl_migrationid": ({ ServiceCheckInID }) => ServiceCheckInID.toString(),
            
            "hl_enrollmentcaseid@odata.bind":  {
                relatedEntity: "hl_enrollmentcases",
                field: "EnrollmentCaseID"
            },

            "hl_begin_date": "CheckinDate",
            "hl_end_date":  "CheckoutDate"
        }
    },
    stageData: async function(){
        let pool = await getSqlConnection();
        await pool.request().execute("[dbo].[hl_stage_unitcheckins]");
    },
    confirmData: async function(){
        let pool = await getSqlConnection();
        await pool.request().execute("[dbo].[hl_confirm_unitcheckins_atag]");
    }
    
}
