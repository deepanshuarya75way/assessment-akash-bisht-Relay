import type { ToolApprovalRequest } from "../types/websocket";

type PermissionProp={
  approval: ToolApprovalRequest;
  onDecision:(
    approvalId: string,
    approved: boolean
  )=> void;
};

export default function Permission({approval, onDecision}: PermissionProp){
  const path= approval.args.path;

  const isWrite=approval.tool==="write_file";

  const isEdit=approval.tool==="edit_file";

  let preview="";
  if(isWrite){
    preview=typeof approval.args.content==="string"? approval.args.content:"";
  }

  if(isEdit){
    
  }

  return (
    <div className="bg-white border-red border">
      <p>Permission required: {approval.tool}</p>
      <button onClick={()=>{
        console.log("allow button in permisino")
        onDecision(approval.approvalId, true)
      }
         }>
        allow
      </button>
      <button onClick={()=> 
        { console.log("deny button in permission")
          onDecision(approval.approvalId, false);
        }
        }>
          deny
      </button>
    </div>
  )


}