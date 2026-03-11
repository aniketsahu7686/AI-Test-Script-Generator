package com.aitestgen.dto;

import com.aitestgen.model.DashboardStats;
import com.aitestgen.model.TestCase;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardResponse {
    private DashboardStats stats;
    private List<TestCase> testCases;
}
