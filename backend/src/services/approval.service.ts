import {WebSocket} from "ws";
import type { ToolApprovalRequest } from "../agent/types";
import { ServerMessage } from "../types/websocket";

type PendingApproval = {
  socket: WebSocket;
  resolve: (approved: boolean) => void;
}

const pendingApprovals = new Map<string, PendingApproval>();

export function requestToolApproval(
  socket: WebSocket,
  request: ToolApprovalRequest,
  send: (message: ServerMessage)=>void
): Promise<boolean>{
  if( pendingApprovals.has(request.approvalId)) return Promise.resolve(false);
  return new Promise<boolean>((resolve)=>{
    let settled=false;
    let timeout: ReturnType<typeof setTimeout>;

    const settle=(approved: boolean)=>{
      if(settled) return;
      settled=true;
      clearTimeout(timeout);
      pendingApprovals.delete(request.approvalId);
      resolve(approved);
    }

    timeout=setTimeout(()=>{
      settle(false)
    }, 60000);

    pendingApprovals.set(request.approvalId, {
      socket,
      resolve: settle
    })

    try{
      send({
        type: "approval_required",
        ...request
      });
    }catch(e){
      console.log(e);
      settle(false);
    }
  })
}

export function resolveToolApproval(
  approvalId: string,
  approved: boolean,
  socket: WebSocket
): boolean{
  const pending=pendingApprovals.get(approvalId);
  console.log("approval ll:",{
    approvalId, found: !!pending
  })
  if(!pending) return false;

  pending.resolve(approved);
  return true;

}

export function cancelSocketApproval(socket:WebSocket): void{
  for(const[approvalId, pending] of pendingApprovals.entries()){
    if(pending.socket===socket) pending.resolve(false);
  }
}