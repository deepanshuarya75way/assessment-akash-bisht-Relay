import { SrvRecord } from "node:dns";

export type AgentMessage =
    | {
        role: "system";
        content: string;
    }
    | {
        role: "user";
        content: string;
    }
    | {
        role: "assistant";
        content: string;
    }
    | {
        role: "assistant";
        toolCallId: string;
        tool: string;
        args: Record<string, unknown>;
    }
    | {
        role: "tool";
        toolCallId: string;
        tool: string;
        content: unknown;
    };

export type Decision =
    | {
        type: "tool_call";
        toolCallId: string;
        tool: string;
        args: Record<string, unknown>;
    }
    | {
        type: "final";
        content: string;
    };

export type ToolResult = {
    success: boolean;
    toolCallId: string;
    tool: string;
    data?: unknown;
    error?: string;
};

export type AgentEvent =
    | {
        type: "tool_start";
        tool: string;
        toolCallId: string;
        args: Record<string, unknown>;
    }
    | {
        type: "tool_result";
        result: ToolResult;
    }
    | {
        type: "final";
        content: string;
    }
    | {
        type: "error";
        message: string;
    }
    |{
        type: "permission_required";
        tool: string;
        message: string;
    }

export type ToolApprovalRequest = {
    approvalId: string;
    tool: string;
    toolCallId: string;
    args: Record<string, unknown>;
}

export type ToolApprovalHandler = (request: ToolApprovalRequest)=> Promise<boolean>